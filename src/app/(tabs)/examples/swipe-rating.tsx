import { useEffect, useMemo, useState } from 'react';
import {Pressable, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import Animated, {
    FadeIn,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    type SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';


type Card = {
    id: number;
    title: string;
    color: string;
};
type StackCardProps = {
    card: Card;
    index: number;
    isTopCard: boolean;
    onPress: () => void;
    stackProgress: SharedValue<number>;
    translateX: SharedValue<number>;
    translateY: SharedValue<number>;
    rotation: SharedValue<number>;
    scale: SharedValue<number>;
    isSwiping: SharedValue<boolean>;
    onSwipeRight: () => void;
    onSwipeLeft: () => void;
    onSwipeCancel: () => void;
};


const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
const CARD_TITLES = ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Пятая'];

const VISIBLE_CARDS = 4;
const CARD_STACK_OFFSET = 14;
const SWIPE_X_THRESHOLD = 90;

function createInitialCards(): Card[] {
    return CARD_TITLES.map((title, index) => ({
        id: Date.now() + index,
            title,
            color: COLORS[index % COLORS.length],
    }))
}

function createCard(index: number): Card {
    return {
        id: Date.now() + index,
        title: CARD_TITLES[index % CARD_TITLES.length],
        color: COLORS[index % COLORS.length],
    }
}

function StackCard({
                       card,
                       index,
                       isTopCard,
                       onPress,
                       stackProgress,
                       translateX,
                       translateY,
                       rotation,
                       scale,
                       isSwiping,
                       onSwipeRight,
                       onSwipeLeft,
                       onSwipeCancel,
                   }: StackCardProps) {
    const panGesture = Gesture.Pan()
        .enabled(isTopCard)
        .onUpdate((event) => {
            if (isSwiping.value || !isTopCard) {
                return;
            }

            translateX.value = event.translationX;
            rotation.value = event.translationX * 0.08;

            const progress = Math.min(
                Math.abs(event.translationX) / SWIPE_X_THRESHOLD,
                1
            );

            stackProgress.value = progress;
        })
        .onEnd(() => {
            if (!isTopCard) {
                return;
            }

            if (translateX.value >= SWIPE_X_THRESHOLD) {
                runOnJS(onSwipeRight)();
                return;
            }

            if (translateX.value <= -SWIPE_X_THRESHOLD) {
                runOnJS(onSwipeLeft)();
                return;
            }

            runOnJS(onSwipeCancel)();
        });
    const cardAnimatedStyle = useAnimatedStyle(() => {
        const baseTranslateY = index * CARD_STACK_OFFSET;
        const nextTranslateY = Math.max(index - 1, 0) * CARD_STACK_OFFSET;

        const baseScale = 1 - index * 0.05;
        const nextScale = 1 - Math.max(index - 1, 0) * 0.05;

        const stackTranslateY =
            baseTranslateY + (nextTranslateY - baseTranslateY) * stackProgress.value;

        const stackScale =
            baseScale + (nextScale - baseScale) * stackProgress.value;

        return {
            zIndex: VISIBLE_CARDS - index,
            transform: [
                { translateX: isTopCard ? translateX.value : 0 },
                { translateY: isTopCard ? stackTranslateY + translateY.value : stackTranslateY },
                { rotateZ: isTopCard ? `${rotation.value}deg` : '0deg' },
                { scale: isTopCard ? stackScale * scale.value : stackScale },
            ],
        };
    });

    const cardContent = (
        <Pressable
            onPress={isTopCard ? onPress : undefined}
            disabled={!isTopCard}
            style={styles.cardPressable}
        >
            <Animated.View
                entering={FadeIn.springify()}
                style={[
                    styles.card,
                    { backgroundColor: card.color },
                    cardAnimatedStyle,
                ]}
            >
                <Text style={styles.cardTitle}>{card.title}</Text>
            </Animated.View>
        </Pressable>
    );

    return (
        <GestureDetector gesture={panGesture}>
            {cardContent}
        </GestureDetector>
    );
}


export default function SwipeRatingScreen() {
    const [cards, setCards] = useState<Card[]>(createInitialCards);
    const [nextCardIndex, setNextCardIndex] = useState(CARD_TITLES.length);
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);

    const stackProgress = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const isSwiping = useSharedValue(false);

    const visibleCards = useMemo(() => {
        return cards.slice(0, VISIBLE_CARDS);
    }, [cards]);

    function finishSwipe() {
        setCards((prev) => {
            const nextCards = prev.slice(1);
            return [...nextCards, createCard(nextCardIndex)];
        });

        setNextCardIndex((prev) => prev + 1);
    }

    useEffect(() => {
        translateX.value = 0;
        translateY.value = 0;
        rotation.value = 0;
        scale.value = 1;
        stackProgress.value = 0;
        isSwiping.value = false;
    }, [cards, isSwiping, rotation, scale, stackProgress, translateX, translateY]);

    function handleResetCounters() {
        setLikesCount(0);
        setDislikesCount(0);
    }

    function handleTopCardPress() {
        console.log('Top card pressed');
    }

    function handleSwipeRight() {
        if (isSwiping.value) {
            return;
        }

        isSwiping.value = true;
        setLikesCount((prev) => prev + 1);

        translateX.value = withSpring(translateX.value + 220, {
            damping: 16,
            stiffness: 140,
        });

        rotation.value = withSpring(rotation.value + 12, {
            damping: 16,
            stiffness: 140,
        });

        stackProgress.value = 1;

        setTimeout(() => {
            finishSwipe();
        }, 280);
    }

    function handleSwipeLeft() {
        if (isSwiping.value) {
            return;
        }

        isSwiping.value = true;
        setDislikesCount((prev) => prev + 1);

        translateX.value = withSpring(translateX.value - 220, {
            damping: 16,
            stiffness: 140,
        });

        rotation.value = withSpring(rotation.value - 12, {
            damping: 16,
            stiffness: 140,
        });

        stackProgress.value = 1;

        setTimeout(() => {
            finishSwipe();
        }, 280);
    }

    function resetCardPosition() {
        translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 140,
        });
        translateY.value = withSpring(0, {
            damping: 15,
            stiffness: 140,
        });
        rotation.value = withSpring(0, {
            damping: 15,
            stiffness: 140,
        });
        scale.value = withSpring(1, {
            damping: 15,
            stiffness: 140,
        });
        stackProgress.value = withSpring(0, {
            damping: 15,
            stiffness: 140,
        });
        isSwiping.value = false;
    }


    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <View style={styles.topBar}>
                <BackButton />
            </View>

            <View style={styles.content}>
                <View style={styles.hero}>
                    <Text style={styles.eyebrow}>Пример</Text>
                    <Text style={styles.title}>Свайп лайк / дизлайк</Text>
                    <Text style={styles.description}>
                        Влево — дизлайк, вправо — лайк, снизу — счётчики и сброс.
                    </Text>
                </View>

                <View style={styles.stackContainer}>
                    {visibleCards
                        .slice()
                        .reverse()
                        .map((card, reversedIndex) => {
                            const index = visibleCards.length - 1 - reversedIndex;
                            const isTopCard = index === 0;

                            return (
                                <StackCard
                                    key={card.id}
                                    card={card}
                                    index={index}
                                    isTopCard={isTopCard}
                                    onPress={handleTopCardPress}
                                    stackProgress={stackProgress}
                                    translateX={translateX}
                                    translateY={translateY}
                                    rotation={rotation}
                                    scale={scale}
                                    isSwiping={isSwiping}
                                    onSwipeRight={handleSwipeRight}
                                    onSwipeLeft={handleSwipeLeft}
                                    onSwipeCancel={resetCardPosition}
                                />
                            );
                        })}
                </View>

                <View style={styles.footer}>
                    <View style={styles.counterBlock}>
                        <Text style={styles.counterIcon}>👎</Text>
                        <Text style={styles.counterValue}>{dislikesCount}</Text>
                    </View>

                    <Pressable style={styles.resetButton} onPress={handleResetCounters}>
                        <Text style={styles.resetButtonText}>Сбросить</Text>
                    </Pressable>

                    <View style={styles.counterBlock}>
                        <Text style={styles.counterIcon}>👍</Text>
                        <Text style={styles.counterValue}>{likesCount}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f0f0f5',
    },
    topBar: {
        paddingHorizontal: 20,
        paddingTop: 0,
    },
    content: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
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
        minHeight: 360,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    card: {
        width: 260,
        height: 360,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
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
    footer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        paddingBottom: 12,
    },
    counterBlock: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    counterIcon: {
        fontSize: 28,
    },
    counterValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1a1a31',
    },
    cardPressable: {
        position: 'absolute',
    },
    resetButton: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 999,
        backgroundColor: '#1a1a31',
    },
    resetButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
});
