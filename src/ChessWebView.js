import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  bgDark: '#161512',
  bgHeader: '#21201d',
  bgCard: '#272522',
  border: '#383531',
  green: '#81b64c',
  gold: '#e58f2a',
  textMain: '#ffffff',
  textMuted: '#bababa',
};

export default function ChessWebView({ initialUrl }) {
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(true);

  // Player search modal
  const [searchText, setSearchText] = useState('');
  const [playerModalVisible, setPlayerModalVisible] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  // Daily puzzle modal
  const [puzzleModalVisible, setPuzzleModalVisible] = useState(false);
  const [puzzleData, setPuzzleData] = useState(null);
  const [puzzleLoading, setPuzzleLoading] = useState(false);

  const insets = useSafeAreaInsets();

  const navigateTo = useCallback((url) => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`window.location.href = '${url}'; true;`);
    }
  }, []);

  const searchPlayer = useCallback(async () => {
    const username = searchText.trim().toLowerCase();
    if (!username) return;
    setPlayerData(null);
    setPlayerError(null);
    setPlayerLoading(true);
    setPlayerModalVisible(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        fetch(`https://api.chess.com/pub/player/${username}`, {
          headers: { 'User-Agent': 'ChessMobileApp/1.0' },
        }),
        fetch(`https://api.chess.com/pub/player/${username}/stats`, {
          headers: { 'User-Agent': 'ChessMobileApp/1.0' },
        }),
      ]);
      if (!profileRes.ok || !statsRes.ok) {
        setPlayerError(`Player "${username}" not found.`);
        return;
      }
      const profile = await profileRes.json();
      const stats = await statsRes.json();
      setPlayerData({ profile, stats });
    } catch (e) {
      setPlayerError('Network error. Please try again.');
    } finally {
      setPlayerLoading(false);
    }
  }, [searchText]);

  const openDailyPuzzle = useCallback(async () => {
    setPuzzleData(null);
    setPuzzleLoading(true);
    setPuzzleModalVisible(true);
    try {
      const res = await fetch('https://api.chess.com/pub/puzzle', {
        headers: { 'User-Agent': 'ChessMobileApp/1.0' },
      });
      if (res.ok) {
        const data = await res.json();
        setPuzzleData(data);
      }
    } catch (e) {
      // silently fail
    } finally {
      setPuzzleLoading(false);
    }
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigateTo('https://www.chess.com/home')} style={styles.brand}>
            <Text style={styles.brandText}>
              CHESS<Text style={{ color: '#e63946' }}>.COM</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.navControls}>
            <TouchableOpacity
              style={[styles.iconBtn, !canGoBack && styles.iconBtnDisabled]}
              onPress={() => webviewRef.current?.goBack()}
              disabled={!canGoBack}>
              <Text style={styles.iconBtnText}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, !canGoForward && styles.iconBtnDisabled]}
              onPress={() => webviewRef.current?.goForward()}
              disabled={!canGoForward}>
              <Text style={styles.iconBtnText}>▶</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => webviewRef.current?.reload()}>
              <Text style={styles.iconBtnText}>🔄</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.dailyBtn} onPress={openDailyPuzzle}>
            <Text style={{ fontSize: 16 }}>💡</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={{ fontSize: 13 }}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search player (e.g. Hikaru)..."
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={searchPlayer}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Loading Bar */}
        {loading && <View style={styles.loadingBar} />}
      </View>

      {/* ── WebView ── */}
      <WebView
        ref={webviewRef}
        source={{ uri: initialUrl }}
        style={styles.webview}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        userAgent="Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />

      {/* ── Player Stats Modal ── */}
      <Modal
        visible={playerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPlayerModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>♟️ Player Stats</Text>
              <TouchableOpacity onPress={() => setPlayerModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {playerLoading && (
              <View style={styles.centered}>
                <ActivityIndicator color={COLORS.green} size="large" />
                <Text style={styles.loadingText}>Fetching stats...</Text>
              </View>
            )}
            {playerError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {playerError}</Text>
              </View>
            )}
            {playerData && !playerLoading && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.playerProfile}>
                  {playerData.profile.avatar ? (
                    <Image source={{ uri: playerData.profile.avatar }} style={styles.avatar} />
                  ) : null}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {playerData.profile.title ? (
                        <View style={styles.titleBadge}>
                          <Text style={styles.titleBadgeText}>{playerData.profile.title}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.playerName}>
                        {playerData.profile.name || playerData.profile.username}
                      </Text>
                    </View>
                    <Text style={styles.playerJoined}>
                      Joined: {new Date(playerData.profile.joined * 1000).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsGrid}>
                  {[
                    { label: '⚡ Blitz',   rating: playerData.stats.chess_blitz?.last?.rating,  record: playerData.stats.chess_blitz?.record },
                    { label: '⏱️ Rapid',   rating: playerData.stats.chess_rapid?.last?.rating,  record: playerData.stats.chess_rapid?.record },
                    { label: '🎯 Bullet',  rating: playerData.stats.chess_bullet?.last?.rating },
                    { label: '🧩 Tactics', rating: playerData.stats.tactics?.highest?.rating },
                  ].map((item) => (
                    <View key={item.label} style={styles.statBox}>
                      <Text style={styles.statLabel}>{item.label}</Text>
                      <Text style={styles.statValue}>{item.rating ?? 'Unrated'}</Text>
                      {item.record ? (
                        <Text style={styles.statRecord}>
                          {item.record.win}W / {item.record.loss}L / {item.record.draw}D
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={() => {
                    setPlayerModalVisible(false);
                    navigateTo(`https://www.chess.com/member/${playerData.profile.username}`);
                  }}>
                  <Text style={styles.modalBtnText}>View Full Profile →</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Daily Puzzle Modal ── */}
      <Modal
        visible={puzzleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPuzzleModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💡 Daily Puzzle</Text>
              <TouchableOpacity onPress={() => setPuzzleModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {puzzleLoading && (
              <View style={styles.centered}>
                <ActivityIndicator color={COLORS.green} size="large" />
                <Text style={styles.loadingText}>Loading puzzle...</Text>
              </View>
            )}
            {!puzzleLoading && puzzleData && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.puzzleTitle}>{puzzleData.title || "Today's Puzzle"}</Text>
                {puzzleData.publish_time ? (
                  <Text style={styles.puzzleDate}>
                    {new Date(puzzleData.publish_time * 1000).toLocaleDateString()}
                  </Text>
                ) : null}
                {puzzleData.image ? (
                  <Image
                    source={{ uri: puzzleData.image }}
                    style={styles.puzzleImage}
                    resizeMode="contain"
                  />
                ) : null}
                {puzzleData.fen ? (
                  <Text style={styles.puzzleFen} numberOfLines={2}>
                    FEN: {puzzleData.fen}
                  </Text>
                ) : null}
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={() => {
                    setPuzzleModalVisible(false);
                    navigateTo(puzzleData.url || 'https://www.chess.com/puzzles');
                  }}>
                  <Text style={styles.modalBtnText}>▶ Play Puzzle</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
            {!puzzleLoading && !puzzleData && (
              <Text style={[styles.errorText, { padding: 16 }]}>Could not load daily puzzle.</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.bgDark },
  header:        { backgroundColor: COLORS.bgHeader, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerRow:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, gap: 6 },
  brand:         { paddingHorizontal: 4 },
  brandText:     { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },
  navControls:   { flexDirection: 'row', gap: 2, flex: 1 },
  iconBtn:       { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  iconBtnDisabled: { opacity: 0.3 },
  iconBtnText:   { color: COLORS.textMuted, fontSize: 12 },
  dailyBtn:      { width: 36, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a2825' },
  searchRow:     { paddingHorizontal: 10, paddingBottom: 8 },
  searchBar:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#181715', borderWidth: 1, borderColor: '#322f2b', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, gap: 6 },
  searchInput:   { flex: 1, color: '#fff', fontSize: 13, padding: 0 },
  loadingBar:    { height: 2, backgroundColor: COLORS.green, width: '60%' },
  webview:       { flex: 1, backgroundColor: COLORS.bgDark },
  modalOverlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'flex-end' },
  modalCard:     { backgroundColor: COLORS.bgCard, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 20, maxHeight: '82%' },
  modalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle:    { color: COLORS.textMain, fontSize: 17, fontWeight: '700' },
  modalClose:    { color: COLORS.textMuted, fontSize: 20, padding: 4 },
  centered:      { alignItems: 'center', paddingVertical: 30, gap: 10 },
  loadingText:   { color: COLORS.textMuted, fontSize: 13 },
  errorBox:      { backgroundColor: '#2f1d1d', borderRadius: 8, padding: 14, marginBottom: 10 },
  errorText:     { color: '#ff8888', fontSize: 13 },
  playerProfile: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar:        { width: 54, height: 54, borderRadius: 8, borderWidth: 2, borderColor: COLORS.green },
  titleBadge:    { backgroundColor: COLORS.gold, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  titleBadgeText:{ color: '#000', fontSize: 10, fontWeight: '800' },
  playerName:    { color: COLORS.textMain, fontSize: 16, fontWeight: '700' },
  playerJoined:  { color: '#888', fontSize: 12, marginTop: 2 },
  statsGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  statBox:       { backgroundColor: '#1e1d1a', borderWidth: 1, borderColor: '#36332f', borderRadius: 8, padding: 12, alignItems: 'center', width: '47%' },
  statLabel:     { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  statValue:     { color: COLORS.green, fontSize: 22, fontWeight: '800' },
  statRecord:    { color: '#888', fontSize: 10, marginTop: 3 },
  modalBtn:      { backgroundColor: COLORS.green, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 6, marginBottom: 8 },
  modalBtnText:  { color: '#fff', fontWeight: '700', fontSize: 14 },
  puzzleTitle:   { color: COLORS.textMain, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  puzzleDate:    { color: '#888', fontSize: 12, marginBottom: 10 },
  puzzleImage:   { width: '100%', height: 220, borderRadius: 8, borderWidth: 1, borderColor: '#444', marginBottom: 10 },
  puzzleFen:     { color: '#aaa', fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', backgroundColor: '#111', padding: 6, borderRadius: 4, marginBottom: 10 },
});
