import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import BackButton from '@/components/BackButton';
import {
    CARD_TITLES,
    VISIBLE_CARDS,
    createCard,
    createInitialCards,
} from './_swipe-rating/cardData';
import SwipeCard from './_swipe-rating/SwipeCard';
import SwipeCounters from './_swipe-rating/SwipeCounters';
import type { Card } from './_swipe-rating/types';

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
    const likeIconScale = useSharedValue(1);
    const dislikeIconScale = useSharedValue(1);

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
        animateLikeIcon();

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
        animateDislikeIcon();

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

    function animateLikeIcon() {
        likeIconScale.value = withSequence(
            withTiming(1.5, { duration: 190 }),
            withTiming(1, { duration: 220 })
        );
    }

    function animateDislikeIcon() {
        dislikeIconScale.value = withSequence(
            withTiming(1.5, { duration: 190 }),
            withTiming(1, { duration: 220 })
        );
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
                                <SwipeCard
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

                <SwipeCounters
                    likesCount={likesCount}
                    dislikesCount={dislikesCount}
                    likeIconScale={likeIconScale}
                    dislikeIconScale={dislikeIconScale}
                    onReset={handleResetCounters}
                />
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
