import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  TextInput, 
  Button, 
  Switch, 
  Text,
  Divider,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { useMonitoring } from '../context/MonitoringContext';

export default function SettingsScreen() {
  const { 
    config, 
    symbols, 
    saveConfig, 
    saveSymbols,
    discoverSymbols,
  } = useMonitoring();

  const [localConfig, setLocalConfig] = useState(config);
  const [symbolInput, setSymbolInput] = useState('');
  const [discovering, setDiscovering] = useState(false);

  const handleSaveConfig = () => {
    saveConfig(localConfig);
    Alert.alert('Success', 'Configuration saved successfully!');
  };

  const handleAddSymbol = () => {
    const trimmed = symbolInput.trim().toUpperCase();
    if (trimmed && !symbols.includes(trimmed)) {
      saveSymbols([...symbols, trimmed]);
      setSymbolInput('');
    }
  };

  const handleRemoveSymbol = (symbol) => {
    saveSymbols(symbols.filter(s => s !== symbol));
  };

  const handleDiscoverSymbols = async () => {
    setDiscovering(true);
    try {
      const discovered = await discoverSymbols();
      Alert.alert(
        'Discovery Complete', 
        `Found ${discovered.length} high-volume symbols!`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to discover symbols');
    }
    setDiscovering(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Monitoring Symbols</Title>
          
          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Add Symbol (e.g., BTC/USDT)"
              value={symbolInput}
              onChangeText={setSymbolInput}
              style={styles.input}
              theme={{ colors: { text: '#fff', placeholder: '#8892b0' } }}
              outlineColor="#0f3460"
              activeOutlineColor="#00d4ff"
            />
            <Button 
              mode="contained" 
              onPress={handleAddSymbol}
              style={styles.addButton}
              buttonColor="#00d4ff"
            >
              Add
            </Button>
          </View>

          <Button
            mode="outlined"
            onPress={handleDiscoverSymbols}
            icon="magnify"
            style={styles.discoverButton}
            loading={discovering}
            disabled={discovering}
          >
            {discovering ? 'Discovering...' : 'Auto-Discover Top Symbols'}
          </Button>

          <View style={styles.chipsContainer}>
            {symbols.length === 0 ? (
              <Text style={styles.emptyText}>No symbols added yet</Text>
            ) : (
              symbols.map((symbol) => (
                <Chip
                  key={symbol}
                  mode="outlined"
                  onClose={() => handleRemoveSymbol(symbol)}
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {symbol}
                </Chip>
              ))
            )}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Alert Thresholds</Title>

          <TextInput
            mode="outlined"
            label="RSI Overbought Threshold (>)"
            value={String(localConfig.rsiOverbought)}
            onChangeText={(text) => 
              setLocalConfig({ ...localConfig, rsiOverbought: parseFloat(text) || 90 })
            }
            keyboardType="numeric"
            style={styles.input}
            theme={{ colors: { text: '#fff', placeholder: '#8892b0' } }}
            outlineColor="#0f3460"
            activeOutlineColor="#00d4ff"
          />

          <TextInput
            mode="outlined"
            label="RSI Oversold Threshold (<)"
            value={String(localConfig.rsiOversold)}
            onChangeText={(text) => 
              setLocalConfig({ ...localConfig, rsiOversold: parseFloat(text) || 10 })
            }
            keyboardType="numeric"
            style={styles.input}
            theme={{ colors: { text: '#fff', placeholder: '#8892b0' } }}
            outlineColor="#0f3460"
            activeOutlineColor="#00d4ff"
          />

          <TextInput
            mode="outlined"
            label="Support/Resistance Threshold (%)"
            value={String(localConfig.srThreshold * 100)}
            onChangeText={(text) => 
              setLocalConfig({ 
                ...localConfig, 
                srThreshold: (parseFloat(text) || 2) / 100 
              })
            }
            keyboardType="numeric"
            style={styles.input}
            theme={{ colors: { text: '#fff', placeholder: '#8892b0' } }}
            outlineColor="#0f3460"
            activeOutlineColor="#00d4ff"
          />

          <Text style={styles.helpText}>
            Price must be within this percentage of support/resistance to trigger alert
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Monitoring Settings</Title>

          <TextInput
            mode="outlined"
            label="Check Interval (seconds)"
            value={String(localConfig.checkInterval)}
            onChangeText={(text) => 
              setLocalConfig({ ...localConfig, checkInterval: parseInt(text) || 300 })
            }
            keyboardType="numeric"
            style={styles.input}
            theme={{ colors: { text: '#fff', placeholder: '#8892b0' } }}
            outlineColor="#0f3460"
            activeOutlineColor="#00d4ff"
          />

          <Text style={styles.helpText}>
            How often to check prices (minimum: 60 seconds)
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Auto-Discovery Settings</Title>

          <TextInput
            mode="outlined"
            label="Quote Currencies (comma-separated)"
            value={localConfig.quoteCurrencies.join(',')}
            onChangeText={(text) => 
              setLocalConfig({ 
                ...localConfig, 
                quoteCurrencies: text.split(',').map(s => s.trim()) 
              })
            }
            style={styles.input}
            theme={{ colors: { text: '#fff', placeholder: '#8892b0' } }}
            outlineColor="#0f3460"
            activeOutlineColor="#00d4ff"
          />

          <TextInput
            mode="outlined"
            label="Minimum 24h Volume ($)"
            value={String(localConfig.minVolume)}
            onChangeText={(text) => 
              setLocalConfig({ ...localConfig, minVolume: parseInt(text) || 1000000 })
            }
            keyboardType="numeric"
            style={styles.input}
            theme={{ colors: { text: '#fff', placeholder: '#8892b0' } }}
            outlineColor="#0f3460"
            activeOutlineColor="#00d4ff"
          />

          <TextInput
            mode="outlined"
            label="Maximum Symbols to Monitor"
            value={String(localConfig.maxSymbols)}
            onChangeText={(text) => 
              setLocalConfig({ ...localConfig, maxSymbols: parseInt(text) || 50 })
            }
            keyboardType="numeric"
            style={styles.input}
            theme={{ colors: { text: '#fff', placeholder: '#8892b0' } }}
            outlineColor="#0f3460"
            activeOutlineColor="#00d4ff"
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSaveConfig}
        style={styles.saveButton}
        buttonColor="#00d4ff"
        icon="content-save"
      >
        Save All Settings
      </Button>

      <View style={styles.infoCard}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>About</Title>
            <Text style={styles.infoText}>
              Crypto Monitor v1.0.0
            </Text>
            <Text style={styles.infoText}>
              Monitors cryptocurrency prices and sends alerts when technical conditions are met.
            </Text>
            <Divider style={styles.divider} />
            <Text style={styles.warningText}>
              ⚠️ This tool is for informational purposes only. Not financial advice.
            </Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#16213e',
  },
  cardTitle: {
    color: '#fff',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginBottom: 12,
    backgroundColor: '#0f3460',
  },
  addButton: {
    justifyContent: 'center',
  },
  discoverButton: {
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#0f3460',
    borderColor: '#00d4ff',
  },
  chipText: {
    color: '#fff',
  },
  emptyText: {
    color: '#8892b0',
    fontStyle: 'italic',
  },
  helpText: {
    color: '#8892b0',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  saveButton: {
    margin: 16,
    paddingVertical: 6,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoText: {
    color: '#8892b0',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#0f3460',
  },
  warningText: {
    color: '#ff006e',
    fontSize: 12,
  },
  footer: {
    height: 20,
  },
});
