// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';

// import CustomButton from '../components/CustomButton';
// import Colors from '../constants/Colors';

// const CustomAddressModal = (props) => {
//   const { address, onText, setAddress, addressSearch } = props;

//   return (
//     <View style={styles.centeredView}>
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={addressModal}
//         onRequestClose={() => {
//           setAddressModal(!addressModal);
//         }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Enter address</Text>
//             <TextInput
//               placeholder="123 main street, mycity..."
//               style={styles.descriptionInput}
//               onChangeText={(text) => setAddress(text)}
//               value={address}
//               autoCapitaliz="words"
//             />
//             <View
//               style={[
//                 styles.buttonContainer,
//                 { marginTop: 15, justifyContent: 'center' },
//               ]}
//             >
//               {fetchAnyways ? (
//                 <CustomButton
//                   style={{ flexDirection: 'row' }}
//                   onSelect={addressSearch}
//                 >
//                   <Text style={styles.locateOnMapText}>Uploading...</Text>
//                   <ActivityIndicator
//                     color="white"
//                     size="small"
//                     style={{ paddingRight: 15 }}
//                   />
//                 </CustomButton>
//               ) : (
//                 <CustomButton onSelect={addressSearch}>
//                   <Text style={styles.locateOnMapText}>Address Upload</Text>
//                 </CustomButton>
//               )}
//             </View>
//             <View style={styles.right}>
//               <MaterialCommunityIcons
//                 name="close"
//                 size={30}
//                 style={styles.iconClose}
//                 onPress={() => setAddressModalVisible(!addressModalVisible)}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 15,
//   },
//   modalView: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     paddingTop: 20,
//     paddingHorizontal: 25,
//     paddingBottom: 20,
//     marginHorizontal: 25,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     fontFamily: 'cereal-medium',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   locateOnMapText: {
//     color: 'white',
//     fontFamily: 'cereal-bold',
//     textAlign: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     fontSize: 19,
//   },
//   right: {
//     alignSelf: 'flex-end',
//   },
//   iconClose: {},
//   commentsInputContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: 16,
//     marginBottom: 20,
//   },
//   commentsInput: {
//     width: '80%',
//     backgroundColor: Colors.lightBlue,
//     borderRadius: 10,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     paddingVertical: 3,
//     paddingHorizontal: 10,
//     fontSize: 16,
//     fontFamily: 'cereal-light',
//   },
//   postButtonContainer: {
//     width: 50,
//     marginLeft: 10,
//   },
//   buttonContainer: {
//     width: 170,
//     marginVertical: 5,
//   },
//   postButton: {
//     width: '100%',
//     backgroundColor: Colors.secondary,
//     borderRadius: 8,
//   },
//   postButtonText: {
//     color: 'white',
//     fontFamily: 'cereal-bold',
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//     fontSize: 16,
//     alignSelf: 'center',
//   },
// });

// export default CustomAddressModal;
