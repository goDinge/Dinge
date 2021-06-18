import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';

import CustomButton from './CustomButton';

const CustomErrorModal = (props) => {
  const { error, errorModal, onClose } = props;
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModal}
        onRequestClose={() => {
          onClose(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTextTitle}>An Error occurred</Text>
            <Text style={styles.modalText}>{error}</Text>
            <View style={styles.buttonContainer}>
              <CustomButton onSelect={() => onClose(false)}>
                <Text style={styles.postButtonText}>Okay</Text>
              </CustomButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTextTitle: {
    fontFamily: 'cereal-bold',
    fontSize: 18,
    marginVertical: 4,
    color: 'black',
  },
  modalText: {
    fontFamily: 'cereal-medium',
    fontSize: 16,
    marginVertical: 6,
    color: 'black',
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
  buttonContainer: {
    width: 170,
    marginVertical: 12,
  },
  postButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default CustomErrorModal;
