import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UNSW_YELLOW = '#ffe600';

function CrestMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.crest, compact && styles.crestCompact]}>
      <View style={styles.crestTop}>
        <View style={styles.crestRed} />
        <View style={styles.crestGold} />
      </View>
      <View style={styles.crestMiddle}>
        <View style={styles.crestWhite} />
        <View style={styles.crestBlack} />
      </View>
      <View style={styles.crestBottom} />
    </View>
  );
}

function ChevronDown() {
  return <View style={styles.chevron} />;
}

export default function LoginScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <CrestMark />
            <Text style={styles.brandName}>UNSW</Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Login to access everything UNSW</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login</Text>

            <Pressable onPress={() => router.replace('/home')} style={({ pressed }) => [styles.unswButton, pressed && styles.pressed]}>
              <View style={styles.unswButtonLogo}>
                <CrestMark compact />
                <Text style={styles.unswSydney}>UNSW{"\n"}SYDNEY</Text>
              </View>
              <Text style={styles.unswButtonText}>Login with UNSW</Text>
            </Pressable>

            <Pressable onPress={() => router.replace('/home')} style={({ pressed }) => [styles.guestButton, pressed && styles.pressed]}>
              <Text style={styles.guestButtonText}>Login as Guest</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.campusButton, pressed && styles.pressed]}>
              <Text style={styles.campusButtonText}>UNSW Sydney</Text>
              <ChevronDown />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: UNSW_YELLOW,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  brand: {
    alignItems: 'flex-start',
  },
  brandName: {
    marginTop: 4,
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
  hero: {
    alignItems: 'center',
    marginTop: 86,
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    color: '#000000',
    fontWeight: '400',
  },
  subtitle: {
    marginTop: 24,
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    minHeight: 436,
    backgroundColor: '#f7f7f7',
    borderRadius: 24,
    paddingTop: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  cardTitle: {
    width: '100%',
    fontSize: 32,
    lineHeight: 38,
    color: '#000000',
    marginBottom: 34,
  },
  unswButton: {
    width: '90%',
    minHeight: 86,
    borderRadius: 24,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    gap: 26,
  },
  unswButtonLogo: {
    alignItems: 'center',
  },
  unswSydney: {
    marginTop: 2,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 13,
    textAlign: 'center',
  },
  unswButtonText: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 26,
  },
  guestButton: {
    width: '90%',
    minHeight: 86,
    borderRadius: 24,
    backgroundColor: UNSW_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 18,
  },
  guestButtonText: {
    color: '#000000',
    fontSize: 21,
    lineHeight: 26,
  },
  campusButton: {
    minWidth: 272,
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: '#dfdddd',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 18,
    marginTop: 18,
    paddingHorizontal: 28,
  },
  campusButtonText: {
    color: '#232323',
    fontSize: 17,
    lineHeight: 22,
  },
  chevron: {
    width: 14,
    height: 14,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#000000',
    transform: [{ rotate: '45deg' }, { translateY: -3 }],
  },
  pressed: {
    opacity: 0.76,
  },
  crest: {
    width: 26,
    height: 34,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  crestCompact: {
    width: 18,
    height: 24,
  },
  crestTop: {
    flex: 1,
    flexDirection: 'row',
  },
  crestRed: {
    flex: 1,
    backgroundColor: '#e1251b',
  },
  crestGold: {
    flex: 1,
    backgroundColor: '#ffd200',
  },
  crestMiddle: {
    flex: 1,
    flexDirection: 'row',
  },
  crestWhite: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  crestBlack: {
    flex: 1,
    backgroundColor: '#000000',
  },
  crestBottom: {
    flex: 1,
    backgroundColor: '#e1251b',
  },
});
