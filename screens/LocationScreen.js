import { View, Text, Button, Alert, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';

// GÜNCELLEME: Deprecated uyarısını düzeltmek için ayarları yeniledik
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Bazı sürümlerde hala gerekli
    shouldShowBanner: true, // Yeni standart
    shouldShowList: true,   // Yeni standart
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function LocationScreen() {
  const [coords, setCoords] = useState(null);

  const getLocation = async () => {
    try {
      // 1. Konum izni iste
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        return;
      }

      // 2. Mevcut konumu al
      const location = await Location.getCurrentPositionAsync({});
      setCoords(location.coords);

      // 3. Bildirim işlemleri (Hata korumalı)
      // Android Expo Go SDK 53+ sorununu aşmak için try-catch içine aldık
      try {
        const notifStatus = await Notifications.requestPermissionsAsync();
        if (notifStatus.status === 'granted') {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Location Retrieved',
              body: 'Your GPS location was successfully fetched.',
            },
            trigger: null, // Hemen gönder
          });
        }
      } catch (notifError) {
        console.log("Bildirim hatası (Expo Go kısıtlaması olabilir):", notifError);
        // Bildirim çalışmasa bile kullanıcıya işlemin bittiğini gösterelim
        if (Platform.OS === 'android') {
          Alert.alert("Info", "Location fetched (Notification skipped due to Expo Go limits)");
        }
      }

    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Get Current Location" onPress={getLocation} />
      {coords && (
        <Text style={styles.text}>
          Lat: {coords.latitude} {"\n"}
          Lng: {coords.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});