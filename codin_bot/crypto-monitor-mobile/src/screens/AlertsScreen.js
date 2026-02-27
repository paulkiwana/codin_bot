import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMonitoring } from '../context/MonitoringContext';

export default function AlertsScreen() {
  const { alerts, clearAlerts } = useMonitoring();

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return price >= 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(6)}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getConditionColor = (condition) => {
    if (condition === 'OVERSOLD') return '#00d4ff';
    if (condition === 'OVERBOUGHT') return '#ff006e';
    return '#8892b0';
  };

  const getConditionIcon = (condition) => {
    if (condition === 'OVERSOLD') return 'arrow-down-bold';
    if (condition === 'OVERBOUGHT') return 'arrow-up-bold';
    return 'alert-circle';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Title style={styles.headerTitle}>Alert History</Title>
          <Button 
            mode="outlined" 
            onPress={clearAlerts}
            icon="delete"
            textColor="#ff006e"
            disabled={alerts.length === 0}
          >
            Clear All
          </Button>
        </View>
        <Text style={styles.headerSubtitle}>
          {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'} recorded
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {alerts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <View style={styles.emptyContent}>
                <Icon name="bell-off-outline" size={64} color="#8892b0" />
                <Title style={styles.emptyTitle}>No Alerts Yet</Title>
                <Paragraph style={styles.emptyText}>
                  When monitoring detects conditions matching your criteria, alerts will appear here.
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} style={styles.alertCard}>
              <Card.Content>
                <View style={styles.alertHeader}>
                  <View style={styles.alertTitleContainer}>
                    <Icon 
                      name={getConditionIcon(alert.condition)} 
                      size={24} 
                      color={getConditionColor(alert.condition)} 
                    />
                    <Title style={styles.alertTitle}>{alert.symbol}</Title>
                  </View>
                  <Chip 
                    style={[
                      styles.conditionChip,
                      { backgroundColor: getConditionColor(alert.condition) }
                    ]}
                    textStyle={styles.conditionText}
                  >
                    {alert.condition}
                  </Chip>
                </View>

                <View style={styles.alertDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Price:</Text>
                    <Text style={styles.detailValue}>
                      {formatPrice(alert.currentPrice)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Near {alert.levelType}:
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatPrice(alert.nearLevel)}
                    </Text>
                  </View>

                  <Divider style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>RSI (4H):</Text>
                    <Text style={[
                      styles.detailValue,
                      alert.rsi4h > 90 && styles.oversold,
                      alert.rsi4h < 10 && styles.overbought,
                    ]}>
                      {alert.rsi4h?.toFixed(2) || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>RSI (1D):</Text>
                    <Text style={[
                      styles.detailValue,
                      alert.rsiDaily > 90 && styles.oversold,
                      alert.rsiDaily < 10 && styles.overbought,
                    ]}>
                      {alert.rsiDaily?.toFixed(2) || 'N/A'}
                    </Text>
                  </View>
                </View>

                <View style={styles.timestampContainer}>
                  <Icon name="clock-outline" size={14} color="#8892b0" />
                  <Text style={styles.timestamp}>
                    {formatDateTime(alert.timestamp)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}

        <View style={styles.footer} />
      </ScrollView>
    </View>
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
    marginBottom: 8,
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
  scrollView: {
    flex: 1,
  },
  emptyCard: {
    margin: 16,
    backgroundColor: '#16213e',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#8892b0',
    textAlign: 'center',
  },
  alertCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#16213e',
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    color: '#fff',
    fontSize: 18,
  },
  conditionChip: {
    height: 28,
  },
  conditionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
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
  divider: {
    marginVertical: 8,
    backgroundColor: '#0f3460',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestamp: {
    color: '#8892b0',
    fontSize: 12,
  },
  footer: {
    height: 20,
  },
});
