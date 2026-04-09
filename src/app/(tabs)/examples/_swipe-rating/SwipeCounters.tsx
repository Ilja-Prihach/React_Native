import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    type SharedValue,
} from 'react-native-reanimated';

type SwipeCountersProps = {
    likesCount: number;
    dislikesCount: number;
    likeIconScale: SharedValue<number>;
    dislikeIconScale: SharedValue<number>;
    onReset: () => void;
};

export default function SwipeCounters({
    likesCount,
    dislikesCount,
    likeIconScale,
    dislikeIconScale,
    onReset,
}: SwipeCountersProps) {
    const likeIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: likeIconScale.value }],
        };
    });

    const dislikeIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: dislikeIconScale.value }],
        };
    });

    return (
        <View style={styles.footer}>
            <View style={styles.counterBlock}>
                <Animated.Text style={[styles.counterIcon, dislikeIconStyle]}>👎</Animated.Text>
                <Text style={styles.counterValue}>{dislikesCount}</Text>
            </View>

            <Pressable style={styles.resetButton} onPress={onReset}>
                <Text style={styles.resetButtonText}>Сбросить</Text>
            </Pressable>

            <View style={styles.counterBlock}>
                <Animated.Text style={[styles.counterIcon, likeIconStyle]}>👍</Animated.Text>
                <Text style={styles.counterValue}>{likesCount}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
