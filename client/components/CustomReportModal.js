import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const CustomReportModal = (props) => {
  const { ding, onModalVisible, onReport, dingReportModal } = props;

  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={dingReportModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Do you want to report this Ding?
            </Text>
            <Pressable
              style={styles.openButton}
              onPress={() => {
                onReport(ding._id);
                Alert.alert('Ding reported!');
                onModalVisible(!dingReportModal);
              }}
            >
              <Text style={styles.reportText}>Report Ding!</Text>
            </Pressable>
            <View style={styles.right}>
              <MaterialCommunityIcons
                name="close"
                size={30}
                style={styles.iconClose}
                onPress={() => onModalVisible(!dingReportModal)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalText: {
    fontFamily: 'cereal-medium',
    fontSize: 16,
    color: 'black',
  },
  reportText: {
    fontFamily: 'cereal-bold',
    fontSize: 20,
    color: Colors.primary,
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  right: {
    width: '100%',
  },
  commentsInput: {
    width: '80%',
    backgroundColor: Colors.lightBlue,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'cereal-light',
  },
  buttonContainer: {
    width: 170,
    marginVertical: 5,
  },
  postButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    alignSelf: 'center',
  },
  commentsContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  iconClose: {
    alignSelf: 'flex-end',
  },
});

export default CustomReportModal;