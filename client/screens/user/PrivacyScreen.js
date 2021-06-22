import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';

const PrivacyScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <ScrollView>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            facilisis aliquet nisi sed dictum. Integer et porta ipsum. In eget
            purus consectetur, sagittis ante at, malesuada lacus. Donec aliquam
            consectetur laoreet. Proin neque orci, ultricies a consequat ac,
            viverra at dolor. Integer congue velit in felis lobortis, ut
            elementum quam suscipit. Etiam ipsum massa, condimentum at tincidunt
            quis, blandit sit amet massa. Mauris et dui id orci sollicitudin
            bibendum a id lorem. Suspendisse blandit quam sapien, at consectetur
            nisl efficitur sit amet. Donec elit mauris, elementum at magna sit
            amet, tristique faucibus lectus. Nullam placerat, enim non mollis
            tincidunt, diam turpis pharetra nunc, et eleifend odio tellus
            hendrerit justo. Morbi volutpat eros non tortor elementum mattis.
            Duis ac malesuada neque, eget mollis dolor. Curabitur faucibus odio
            at lorem volutpat, vel dictum nunc condimentum. Quisque quam magna,
            ornare semper odio ac, bibendum viverra nisl. In id ex eget ante
            cursus efficitur. Nullam nisl dui, interdum a risus a, tincidunt
            lobortis magna. Vivamus porta sapien eu varius placerat. Maecenas eu
            nibh eget elit faucibus scelerisque. Cras suscipit bibendum
            pulvinar. Pellentesque vel neque libero. Cras at tellus faucibus,
            hendrerit arcu finibus, laoreet urna. Ut id ipsum nec odio
            consectetur pellentesque. Curabitur auctor magna vel eros dictum
            pharetra. Etiam sed est quis felis porta aliquet. Donec sagittis
            pulvinar sagittis. Maecenas eleifend, elit at finibus ullamcorper,
            diam arcu vehicula felis, non consequat tortor dolor eget tortor.
            Cras rutrum, nunc eu posuere eleifend, ligula elit ultrices arcu, in
            commodo velit arcu aliquet orci. Ut convallis neque nec ex rhoncus
            condimentum in vulputate arcu. Praesent et ante eu sem consectetur
            pellentesque. Aenean venenatis tellus justo, nec pretium dolor
            laoreet in. Proin quis posuere urna. Mauris egestas felis et diam
            posuere pulvinar.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    width: '90%',
    height: '93%',
    marginVertical: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontFamily: 'cereal-medium',
    fontSize: 22,
    color: Colors.primary,
    paddingVertical: 10,
  },
  text: {
    fontFamily: 'cereal-book',
    fontSize: 14,
    color: '#444',
  },
});
