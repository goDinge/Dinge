import * as Location from 'expo-location';

const getLocationFn = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    return location;
  } catch (err) {
    console.log(err.message);
  }
};

const recursiveLast = (count, location) => {
  if (count > 9) {
    //after too many attempts, just set location and launch app anyways
    console.log('count over 9', location);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    });
    setModalVisible(true);
    return;
  } else if ((location != null && location.coords.accuracy) > 30) {
    //if accuracy is over 30, rerun
    getLocation();
    count = count + 1;
  } else {
    //if not too many attempts and accuracy at or below 30
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    });
    return;
  }
};

export { getLocationFn, recursiveLast };
