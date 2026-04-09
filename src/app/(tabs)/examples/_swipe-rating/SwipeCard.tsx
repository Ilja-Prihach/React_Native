import { Pressable, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    FadeIn,
    runOnJS,
    useAnimatedStyle,
    type SharedValue,
} from 'react-native-reanimated';
import {
    CARD_STACK_OFFSET,
    SWIPE_X_THRESHOLD,
    VISIBLE_CARDS,
} from './cardData';
import type { Card } from './types';

type SwipeCardProps = {
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

export default function SwipeCard({
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
}: SwipeCardProps) {
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

    const likeBadgeStyle = useAnimatedStyle(() => {
        const opacity = isTopCard
            ? Math.min(Math.max(translateX.value / SWIPE_X_THRESHOLD, 0), 1)
            : 0;

        return {
            opacity,
            transform: [
                { scale: 0.75 + opacity * 0.4 },
                { rotateZ: '-10deg' },
            ],
        };
    });

    const dislikeBadgeStyle = useAnimatedStyle(() => {
        const opacity = isTopCard
            ? Math.min(Math.max(-translateX.value / SWIPE_X_THRESHOLD, 0), 1)
            : 0;

        return {
            opacity,
            transform: [
                { scale: 0.75 + opacity * 0.4 },
                { rotateZ: '10deg' },
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
                <Animated.View style={[styles.badge, styles.likeBadge, likeBadgeStyle]}>
                    <Text style={[styles.badgeText, styles.likeBadgeText]}>LIKE</Text>
                </Animated.View>

                <Animated.View style={[styles.badge, styles.dislikeBadge, dislikeBadgeStyle]}>
                    <Text style={[styles.badgeText, styles.dislikeBadgeText]}>NOPE</Text>
                </Animated.View>

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

const styles = StyleSheet.create({
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
    badge: {
        position: 'absolute',
        top: 28,
        borderWidth: 3,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
    },
    likeBadge: {
        left: 24,
        borderColor: '#22c55e',
    },
    dislikeBadge: {
        right: 24,
        borderColor: '#ef4444',
    },
    badgeText: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 1,
    },
    likeBadgeText: {
        color: '#22c55e',
    },
    dislikeBadgeText: {
        color: '#ef4444',
    },
});
