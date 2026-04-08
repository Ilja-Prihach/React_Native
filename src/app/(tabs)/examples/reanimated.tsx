import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import BackButton from '@/components/BackButton';

type Card = {
    id: number;
    title: string;
    color: string;
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
const CARD_TITLES = ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Пятая'];
const VISIBLE_CARDS = 4;
const CARD_STACK_OFFSET = 14;

function createInitialCards(): Card[] {
    return CARD_TITLES.map((title, i) => ({
        id: Date.now() + i,
        title,
        color: COLORS[i % COLORS.length],
    }));
}

function createCard(index: number): Card {
    return {
        id: Date.now() + index,
        title: CARD_TITLES[index % CARD_TITLES.length],
        color: COLORS[index % COLORS.length],
    };
}

export default function ReanimatedScreen() {
    const [cards, setCards] = useState<Card[]>(createInitialCards);

    const scrollY = useSharedValue(0);
    const stackProgress = useSharedValue(0);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        }
    })

    const visibleCards = useMemo(() => {
        return cards.slice(0, VISIBLE_CARDS);
    }, [cards]);

    const topCardStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotateZ: `${rotation.value}deg` },
                { scale: scale.value },
            ],
        };
    });

    function finishSwipe(){
        setCards((prev) => {
            const nextCards = prev.slice(1);
            return nextCards.length > 0 ? nextCards : createInitialCards();
        })
        translateX.value = 0;
        translateY.value = 0;
        rotation.value = 0;
        scale.value = 1;
        stackProgress.value = 0;
    }

    function handleSwipe() {
        translateX.value = withSpring(120, {
            damping: 14,
            stiffness: 120,
        });
        translateY.value = withTiming(-520, { duration: 720 });
        rotation.value = withTiming(18, { duration: 720 });
        stackProgress.value = withTiming(1, { duration: 520 }, (finished) => {
            if (finished) {
                runOnJS(finishSwipe)();
            }
        });
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <View style={styles.topBar}>
                <BackButton />
            </View>
            <Animated.ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.hero}>
                    <Text style={styles.eyebrow}>Пример</Text>
                    <Text style={styles.title}>Reanimated анимации</Text>
                    <Text style={styles.description}>
                        Нажми на карточку — она улетит с пружинной и timing-анимацией.
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
                                <Pressable
                                    key={card.id}
                                    onPress={isTopCard ? handleSwipe : undefined}
                                    disabled={!isTopCard}
                                    style={styles.cardPressable}
                                >
                                    <Animated.View
                                        style={[
                                            styles.card,
                                            {
                                                backgroundColor: card.color,
                                                zIndex: VISIBLE_CARDS - index,
                                                transform: [
                                                    {
                                                        translateY:
                                                            index * CARD_STACK_OFFSET - stackProgress.value * index * CARD_STACK_OFFSET,
                                                    },
                                                    {
                                                        scale:
                                                            1 - index * 0.05 + stackProgress.value * index * 0.05,
                                                    },
                                                ],
                                            },
                                            isTopCard && topCardStyle,
                                        ]}
                                    >
                                        <Text style={styles.cardTitle}>{card.title}</Text>
                                    </Animated.View>
                                </Pressable>
                            );
                        })}
                </View>
            </Animated.ScrollView>

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
    },
    contentContainer: {
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
        width: '100%',
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    cardPressable: {
        position: 'absolute',
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
});