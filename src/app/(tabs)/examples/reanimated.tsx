import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';

export default function ReanimatedScreen() {
    return (
        <SafeAreaView style={styles.screen} edges={[`top`]}>
            <View style={styles.topBar}>
                <BackButton/>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.hero}>
                    <Text style={styles.eyebrow}>Пример</Text>
                    <Text style={styles.title}>Reanimated анимации</Text>
                    <Text style={styles.description}>
                        Здесь будут примеры анимаций на UI-потоке через react-native-reanimated.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
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
        padding: 20,
        paddingTop: 8,
        paddingBottom: 36,
        gap: 18,
    },
    hero: {
        backgroundColor: '#f5f5ff',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#d5d5ef',
        gap: 10,
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