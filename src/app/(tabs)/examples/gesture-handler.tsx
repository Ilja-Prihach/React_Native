import { useEffect, useMemo, useState } from 'react';
import { type ImageSourcePropType, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import BackButton from '@/components/BackButton';

const IMAGES = [
  require('../../../../assets/bread.jpg'),
  require('../../../../assets/pulse.jpg'),
  require('../../../../assets/uber.jpg'),
];
const CARD_TITLES = ['Хлеб', 'Пульс', 'Uber'];
const VISIBLE_CARDS = 3;
const SWIPE_THRESHOLD = 120;

type Card = {
  id: number;
  image: ImageSourcePropType;
  title: string;
};

function createCards(): Card[] {
  return IMAGES.map((img, i) => ({
    id: Date.now() + i,
    image: img,
    title: CARD_TITLES[i],
  }));
}

// --- Компонент одной карточки в стеке ---
type StackCardProps = {
  card: Card;
  index: number;
  isTop: boolean;
  swipeProgress: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  rotation: SharedValue<number>;
  scale: SharedValue<number>;
  likeScale: SharedValue<number>;
  isAnimating: SharedValue<boolean>;
  gestureRotation: SharedValue<number>;
  baseGestureRotation: SharedValue<number>;
  activeGestureRotation: SharedValue<number>;
  heartOpacity: SharedValue<number>;
  onSwipeDismiss: () => void;
  onSwipeCancel: () => void;
  onLike: () => void;
};

function StackCard({
  card,
  index,
  isTop,
  swipeProgress,
  translateX,
  translateY,
  rotation,
  scale,
  likeScale,
  isAnimating,
  gestureRotation,
  baseGestureRotation,
  activeGestureRotation,
  heartOpacity,
  onSwipeDismiss,
  onSwipeCancel,
  onLike,
}: StackCardProps) {
  const panGesture = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((event) => {
      if (isAnimating.value || !isTop) return;
      translateX.value = event.translationX;
      rotation.value = event.translationX / 20;
      swipeProgress.value = Math.min(Math.abs(event.translationX) / SWIPE_THRESHOLD, 1);
    })
    .onEnd(() => {
      if (!isTop) return;

      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        runOnJS(onSwipeDismiss)();
        return;
      }
      runOnJS(onSwipeCancel)();
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(isTop)
    .onUpdate((event) => {
      if (isAnimating.value || !isTop) return;
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });

  const rotationGesture = Gesture.Rotation()
    .enabled(isTop)
    .onUpdate((event) => {
      if (isAnimating.value || !isTop) return;
      activeGestureRotation.value = event.rotation;
      gestureRotation.value = baseGestureRotation.value + activeGestureRotation.value;
    })
    .onEnd(() => {
      activeGestureRotation.value = 0;
      gestureRotation.value = withSpring(0);
      baseGestureRotation.value = 0;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (!isTop || isAnimating.value) return;
      likeScale.value = withSequence(
        withTiming(1.15, { duration: 100 }),
        withSpring(1),
      );
      heartOpacity.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 600 }),
      );
      runOnJS(onLike)();
    });

  const composedGesture = Gesture.Simultaneous(
    Gesture.Race(doubleTapGesture, panGesture),
    pinchGesture,
    rotationGesture,
  );

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const baseScaleVal = 1 - index * 0.05;
    const nextScaleVal = 1 - Math.max(index - 1, 0) * 0.05;
    const stackScale = baseScaleVal + (nextScaleVal - baseScaleVal) * swipeProgress.value;

    const baseTranslateVal = index * -12;
    const nextTranslateVal = Math.max(index - 1, 0) * -12;
    const stackTranslateY = baseTranslateVal + (nextTranslateVal - baseTranslateVal) * swipeProgress.value;

    return {
      zIndex: VISIBLE_CARDS - index,
      transform: [
        { translateX: isTop ? translateX.value : 0 },
        { translateY: isTop ? stackTranslateY + translateY.value : stackTranslateY },
        { rotateZ: isTop ? `${rotation.value * (Math.PI / 180) + gestureRotation.value}rad` : '0deg' },
        { scale: isTop ? stackScale * scale.value * likeScale.value : stackScale },
      ],
    };
  });

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: 0.6 + heartOpacity.value * 0.5 }],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Pressable style={styles.cardPressable}>
        <Animated.View
          entering={FadeIn.springify()}
          style={[styles.card, cardAnimatedStyle, { zIndex: VISIBLE_CARDS - index }]}
        >
          <Image source={card.image} style={styles.cardImage} resizeMode="cover" />
          <Animated.View style={[styles.heartBadge, heartStyle]}>
            <Text style={styles.heartIcon}>❤️</Text>
          </Animated.View>
          <View style={styles.cardOverlay}>
            <Text style={styles.cardTitle}>{card.title}</Text>
          </View>
        </Animated.View>
      </Pressable>
    </GestureDetector>
  );
}

// --- Основной экран ---
export default function GestureHandlerScreen() {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [swipeCount, setSwipeCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [nextCardIndex, setNextCardIndex] = useState(IMAGES.length);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const likeScale = useSharedValue(1);
  const swipeProgress = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const heartOpacity = useSharedValue(0);
  const gestureRotation = useSharedValue(0);
  const baseGestureRotation = useSharedValue(0);
  const activeGestureRotation = useSharedValue(0);

  const visibleCards = useMemo(() => cards.slice(0, VISIBLE_CARDS), [cards]);

  // --- Сброс shared values после смены карточек ---
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
    scale.value = 1;
    swipeProgress.value = 0;
    isAnimating.value = false;
    likeScale.value = 1;
    heartOpacity.value = 0;
    gestureRotation.value = 0;
    baseGestureRotation.value = 0;
    activeGestureRotation.value = 0;
  }, [cards, isAnimating, likeScale, rotation, scale, swipeProgress, translateX, translateY, heartOpacity, gestureRotation, baseGestureRotation, activeGestureRotation]);

  // --- Удаление верхней карточки ---
  function finishSwipe() {
    setCards((prev) => {
      const next = prev.slice(1);
      const idx = nextCardIndex;
      return [
        ...next,
        {
          id: Date.now(),
          image: IMAGES[idx % IMAGES.length],
          title: CARD_TITLES[idx % CARD_TITLES.length],
        },
      ];
    });
    setNextCardIndex((prev) => prev + 1);
    setSwipeCount((prev) => prev + 1);
  }

  // --- Свайп: карточка улетает ---
  function handleSwipeDismiss() {
    if (isAnimating.value) return;
    isAnimating.value = true;

    const direction = translateX.value > 0 ? 1 : -1;

    translateX.value = withSpring(direction * 300, {
      damping: 16,
      stiffness: 140,
    });
    translateY.value = withTiming(-600, { duration: 400 });
    rotation.value = withSpring(direction * 15, {
      damping: 16,
      stiffness: 140,
    });
    swipeProgress.value = 1;

    setTimeout(() => {
      finishSwipe();
    }, 350);
  }

  // --- Недостаточный свайп: возврат ---
  function handleSwipeCancel() {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotation.value = withSpring(0);
    swipeProgress.value = withSpring(0);
  }

  // --- Сброс колоды ---
  function resetDeck() {
    setCards(createCards());
    setSwipeCount(0);
    setLikesCount(0);
    setNextCardIndex(IMAGES.length);
  }

  return (
    <GestureHandlerRootView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topBar}>
          <BackButton />
        </View>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Пример</Text>
            <Text style={styles.title}>Карточная колода</Text>
            <Text style={styles.description}>
              Свайп ← → — карточка улетает. Зум — двумя пальцами. Двойной тап — лайк.
            </Text>
          </View>

          <View style={styles.stackContainer}>
            {visibleCards
              .slice()
              .reverse()
              .map((card, reversedIndex) => {
                const index = visibleCards.length - 1 - reversedIndex;

                return (
                  <StackCard
                    key={card.id}
                    card={card}
                    index={index}
                    isTop={index === 0}
                    swipeProgress={swipeProgress}
                    translateX={translateX}
                    translateY={translateY}
                    rotation={rotation}
                    scale={scale}
                    likeScale={likeScale}
                    isAnimating={isAnimating}
                    gestureRotation={gestureRotation}
                    baseGestureRotation={baseGestureRotation}
                    activeGestureRotation={activeGestureRotation}
                    heartOpacity={heartOpacity}
                    onSwipeDismiss={handleSwipeDismiss}
                    onSwipeCancel={handleSwipeCancel}
                    onLike={() => setLikesCount((c) => c + 1)}
                  />
                );
              })}
          </View>

          <View style={styles.footer}>
            <Text style={styles.counter}>❤️ {likesCount}</Text>
            <Pressable onPress={resetDeck} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Заново</Text>
            </Pressable>
            <Text style={styles.counter}>Свайпнуто: {swipeCount}</Text>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 8,
    paddingBottom: 36,
    gap: 18,
    alignItems: 'center',
  },
  hero: {
    backgroundColor: '#f5f5ff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#d5d5ef',
    gap: 10,
    width: '100%',
  },
  stackContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPressable: {
    position: 'absolute',
  },
  card: {
    width: 280,
    height: 380,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  heartBadge: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
  },
  heartIcon: {
    fontSize: 80,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  counter: {
    fontSize: 14,
    color: '#666',
  },
  resetButton: {
    backgroundColor: '#e0e0ef',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a4a75',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#5e5e93',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1a1a31',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a4a75',
  },
});
