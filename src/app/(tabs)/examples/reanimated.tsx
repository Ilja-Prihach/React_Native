import { useState } from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';
import BackButton from '@/components/BackButton';

type Card = {
    id: number;
    title: string;
    color: string;
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
const CARD_TITLES = ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Пятая'];

function createInitialCards(): Card[] {
    return CARD_TITLES.map((title, i) => ({
        id: Date.now() + i,
        title,
        color: COLORS[i % COLORS.length],
    }));
}

export default function ReanimatedScreen() {
    const [cards, setCards] = useState<Card[]>(createInitialCards);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

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

    function handleSwipe() {
        translateX.value = withSpring(200);
        translateY.value = withTiming(-600, { duration: 500 });
        rotation.value = withTiming(15, { duration: 500 });

        setTimeout(() => {
            setCards((prev) => {
                const nextCards = prev.slice(1);
                return nextCards.length > 0 ? nextCards : createInitialCards();
            });

            translateX.value = 0;
            translateY.value = 0;
            rotation.value = 0;
            scale.value = 1;
        }, 550);
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <View style={styles.topBar}>
                <BackButton />
            </View>
            <View style={styles.content}>
                <View style={styles.hero}>
                    <Text style={styles.eyebrow}>Пример</Text>
                    <Text style={styles.title}>Reanimated анимации</Text>
                    <Text style={styles.description}>
                        Нажми на карточку — она улетит с пружинной и timing-анимацией.
                    </Text>
                </View>

                <View style={styles.stackContainer}>
                    {cards.length > 0 && (
                        <Pressable onPress={handleSwipe}>
                            <Animated.View
                                style={[styles.card, { backgroundColor: cards[0].color }, topCardStyle]}
                            >
                                <Text style={styles.cardTitle}>{cards[0].title}</Text>
                            </Animated.View>
                        </Pressable>
                    )}
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