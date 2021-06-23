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
            This Privacy Policy was last revised on 06/23/2021
          </Text>
          <Text style={styles.text}>
            Dinge, LLC (Dinge) understands the importance of protecting personal
            information. This Privacy Policy outlines how Dinge collects, uses,
            and discloses your personal information. You will also find
            information on how we protect your personal information.
          </Text>
          <Text style={styles.statsTitle}>
            1. What information do we collect?
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Account information: </Text>When you
            register a Dinge account, we collect your user name and email
            address. We use this information for account identification and
            email communication about account status and app updates.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Device information: </Text>When you
            install the Dinge mobile app to your mobile device, we collect
            device ID/name and model. We use this information for device
            identification.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Location information: </Text>When you
            use the GPS Upload feature on the Dinge mobile app, we use location
            data through GPS, wifi, or cellular triangulation to determine where
            the image marker will be placed. We maintain this data only so long
            as is reasonable to provide our service. Out-of-date data is removed
            from our database.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Log files: </Text>Our server
            automatically gathers some anonymous information about visitors,
            including IP addresses, browser type, language, and the times and
            dates of web page visits. The data collected does not include
            personally identifiable information and is used for server
            performance analysis and troubleshooting purpose.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Cookies: </Text>We use cookies to keep
            you logged in and save your visit preferences.
          </Text>
          <Text style={styles.statsTitle}>
            2. How long do we retain your information?
          </Text>
          <Text style={styles.text}>
            We will retain your information for as long as is reasonable to
            provide our service. Out-of-date information will be removed from
            our database. We will retain and use your information to the extent
            necessary to comply with our legal obligations (for example, if we
            are required to retain your data to comply with applicable laws),
            resolve disputes, and enforce our legal agreements and policies.
          </Text>
          <Text style={styles.text}>
            We will also retain log files for internal analysis purposes. Log
            files are generally retained for a shorter period of time, except
            when this data is used to strengthen the security or to improve the
            functionality of our service, or we are legally obligated to retain
            this data for longer time periods.
          </Text>
          <Text style={styles.statsTitle}>
            3. Where do we store your information?
          </Text>
          <Text style={styles.text}>
            We host our databases and servers in Amazon Web Service and MongoDB
            in the US.
          </Text>
          <Text style={styles.statsTitle}>
            4. How do we protect your information?
          </Text>
          <Text style={styles.text}>
            We have implemented procedures to safeguard and secure the
            information we collect from loss, misuse, unauthorized access,
            disclosure, alteration, and destruction and to help maintain data
            accuracy and ensure that your personal data is used appropriately.
          </Text>
          <Text style={styles.text}>
            We protect your data on-line. Data access is protected by an account
            authentication process. Only account holder who knows the account
            credential can access to your own data in your account. Other users
            cannot access your data unless you have opted in location sharing.
          </Text>
          <Text style={styles.text}>
            We protect your data off-line. Your account and location data are
            stored in our secured databases. Only employee who needs the
            information to perform a specific job is granted access. The server
            in which we store our database is hosted with Amazon Web Service and
            MongoDB in a secure environment.
          </Text>
          <Text style={styles.statsTitle}>
            5. Do we share your information to outside parties?
          </Text>
          <Text style={styles.text}>
            We do not share your personal data with third parties, other than as
            necessary to fulfill our services. We do not sell your personal data
            to any third parties. We may be required to disclose an individual’s
            personal data in response to a lawful request by public authorities,
            including to meet national security or law enforcement requirements.
            For example, we may share information to respond to a court order,
            subpoena, or request from a law enforcement agency.
          </Text>
          <Text style={styles.statsTitle}>6. Contact us</Text>
          <Text style={styles.text}>
            If you have questions or concerns regarding this Privacy Policy, you
            should first email us at support@dinge.com.
          </Text>
          <Text style={styles.statsTitle}>
            7. How often do we update this Privacy Policy?
          </Text>
          <Text style={styles.text}>
            We may modify this Privacy Policy from time to time. Please see the
            revised date at the top of this page to see when this Privacy Policy
            was last revised.
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
    marginBottom: 10,
  },
  textBold: {
    fontFamily: 'cereal-bold',
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  statsTitle: {
    textAlign: 'left',
    fontFamily: 'cereal-bold',
    fontSize: 18,
    color: '#444',
    marginTop: 5,
    marginBottom: 10,
  },
});
