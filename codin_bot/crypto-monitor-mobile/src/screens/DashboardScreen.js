import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Surface, Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMonitoring } from '../context/MonitoringContext';

export default function DashboardScreen() {
  const { 
    isMonitoring, 
    symbols, 
    marketData, 
    lastCheck, 
    toggleMonitoring,
    checkSymbols 
  } = useMonitoring();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await checkSymbols();
    setRefreshing(false);
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return price >= 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(6)}`;
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleTimeString();
  };

  const getConditionColor = (condition) => {
    if (condition === 'OVERSOLD') return '#00d4ff';
    if (condition === 'OVERBOUGHT') return '#ff006e';
    return '#8892b0';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Title style={styles.headerTitle}>Crypto Monitor</Title>
            <Paragraph style={styles.headerSubtitle}>
              Last check: {formatTime(lastCheck)}
            </Paragraph>
          </View>
          <Button
            mode={isMonitoring ? "contained" : "outlined"}
            onPress={toggleMonitoring}
            icon={isMonitoring ? "stop" : "play"}
            buttonColor={isMonitoring ? "#00d4ff" : undefined}
          >
            {isMonitoring ? "Stop" : "Start"}
          </Button>
        </View>
      </Surface>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statContent}>
              <Icon name="chart-line" size={32} color="#00d4ff" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{symbols.length}</Text>
                <Text style={styles.statLabel}>Symbols</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statContent}>
              <Icon name="bell-ring" size={32} color="#ff006e" />
              <View style={styles.statText}>
                <Text style={styles.statValue}>
                  {Object.values(marketData).filter(d => d?.shouldAlert).length}
                </Text>
                <Text style={styles.statLabel}>Active Alerts</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Title style={styles.sectionTitle}>Market Overview</Title>

      {symbols.length === 0 && (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Paragraph style={styles.emptyText}>
              No symbols configured. Go to Settings to add symbols.
            </Paragraph>
          </Card.Content>
        </Card>
      )}

      {symbols.map((symbol) => {
        const data = marketData[symbol];
        
        if (!data) {
          return (
            <Card key={symbol} style={styles.symbolCard}>
              <Card.Content>
                <View style={styles.symbolHeader}>
                  <Title style={styles.symbolTitle}>{symbol}</Title>
                  <ActivityIndicator size="small" />
                </View>
              </Card.Content>
            </Card>
          );
        }

        return (
          <Card 
            key={symbol} 
            style={[
              styles.symbolCard,
              data.shouldAlert && styles.symbolCardAlert
            ]}
          >
            <Card.Content>
              <View style={styles.symbolHeader}>
                <Title style={styles.symbolTitle}>{symbol}</Title>
                {data.shouldAlert && (
                  <Chip 
                    icon="alert" 
                    style={[
                      styles.alertChip,
                      { backgroundColor: getConditionColor(data.condition) }
                    ]}
                    textStyle={styles.alertChipText}
                  >
                    ALERT
                  </Chip>
                )}
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.price}>{formatPrice(data.currentPrice)}</Text>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>RSI (4H):</Text>
                  <Text style={[
                    styles.detailValue,
                    data.rsi4h > 90 && styles.oversold,
                    data.rsi4h < 10 && styles.overbought,
                  ]}>
                    {data.rsi4h?.toFixed(2) || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>RSI (1D):</Text>
                  <Text style={[
                    styles.detailValue,
                    data.rsiDaily > 90 && styles.oversold,
                    data.rsiDaily < 10 && styles.overbought,
                  ]}>
                    {data.rsiDaily?.toFixed(2) || 'N/A'}
                  </Text>
                </View>
              </View>

              {data.nearLevel && (
                <View style={styles.levelContainer}>
                  <Icon 
                    name={data.levelType === 'support' ? 'arrow-down' : 'arrow-up'} 
                    size={16} 
                    color={data.levelType === 'support' ? '#00d4ff' : '#ff006e'} 
                  />
                  <Text style={styles.levelText}>
                    Near {data.levelType?.toUpperCase()}: {formatPrice(data.nearLevel)}
                  </Text>
                </View>
              )}

              {data.condition && (
                <View style={styles.conditionContainer}>
                  <Chip 
                    style={[
                      styles.conditionChip,
                      { backgroundColor: getConditionColor(data.condition) }
                    ]}
                    textStyle={styles.conditionText}
                  >
                    {data.condition}
                  </Chip>
                </View>
              )}
            </Card.Content>
          </Card>
        );
      })}

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 16,
    backgroundColor: '#16213e',
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#8892b0',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#16213e',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#8892b0',
  },
  sectionTitle: {
    color: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  emptyCard: {
    margin: 16,
    backgroundColor: '#16213e',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8892b0',
  },
  symbolCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#16213e',
  },
  symbolCardAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  symbolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbolTitle: {
    color: '#fff',
    fontSize: 18,
  },
  alertChip: {
    height: 28,
  },
  alertChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceContainer: {
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  detailsContainer: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    color: '#8892b0',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  oversold: {
    color: '#00d4ff',
  },
  overbought: {
    color: '#ff006e',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#0f3460',
    borderRadius: 8,
  },
  levelText: {
    color: '#fff',
    fontSize: 13,
  },
  conditionContainer: {
    marginTop: 8,
  },
  conditionChip: {
    alignSelf: 'flex-start',
  },
  conditionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    height: 20,
  },
});
