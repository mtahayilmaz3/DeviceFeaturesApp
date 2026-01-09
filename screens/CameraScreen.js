import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function CameraScreen() {
  const [imageUri, setImageUri] = useState(null);

  // Galeriden resim seçme fonksiyonu
  const pickImage = async () => {
    // İzin isteme
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Galeriye erişim izni gerekiyor.');
      return;
    }

    // Galeriyi açma
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // PDF'te belirtilmemiş ama eklemek iyidir, hata verirse kaldırabilirsin.
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    // PDF'teki basit versiyon (üstteki ayarlar hata verirse bunu kullan):
    // const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Başarılı seçimde hafif titreşim
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  // Fotoğraf çekme fonksiyonu
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission required', 'Kamera erişim izni gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Başarılı çekimde bildirim titreşimi
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick from Gallery" onPress={pickImage} />
      <Button title="Take Photo" onPress={takePhoto} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'center', // İçeriği ortalamak için
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    resizeMode: 'contain', // Resmin düzgün görünmesi için
  },
});