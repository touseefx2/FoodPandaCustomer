import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  Dimensions,
  Alert,
  Keyboard,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-easy-toast';
import NetInfo from '@react-native-community/netinfo';

export default observer(Login);
function Login(props) {
  const toast = useRef(null);
  const toastduration = 700;

  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;

  let loader = store.User.loader;
  const mobileReg = /^[3]\d{9}$/ || /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const [phone, setphone] = useState('');
  const [email, setemail] = useState(''); //street adress
  const [pswd, setpswd] = useState('');
  const [spswd, setspswd] = useState(false);

  const [d1, setd1] = useState(false);
  const [d2, setd2] = useState(false);

  let s = props.route.params.screen || '';

  const goBack = () => {
    props.navigation.goBack();
  };

  const Login = () => {
    Keyboard.dismiss();
    if (phone == '') {
      toast?.current?.show('Please enter your phone number');
      return;
    }

    if (phone !== '' && mobileReg.test(phone) === false) {
      toast?.current?.show('Your phone number is inavlid');
      return;
    }

    const data = {
      // email: '',
      mobile: '+92' + phone,
      // password: '',
      registrationToken: store.User.notificationToken,
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        props.navigation.navigate('OTP', {screen: 'login', data: data, s: s});
      } else {
        toast?.current?.show('Please connect internet', toastduration);
      }
    });

    // if (phone == '') {
    //   const data = {
    //     email: email.toLowerCase(),
    //     mobile: '',
    //     password: pswd,
    //     registrationToken: store.User.notificationToken,
    //   };

    //   if (email == '') {
    //     toast?.current?.show('Please enter your email');
    //     return;
    //   }

    //   if (emailReg.test(email) === false) {
    //     toast?.current?.show('Please enter correct email');
    //     return;
    //   }

    //   if (pswd === '') {
    //     toast?.current?.show('Please enter password');
    //     return;
    //   }

    //   NetInfo.fetch().then(state => {
    //     if (state.isConnected) {
    //       store.User.attemptToLogin(data, goHome);
    //     } else {
    //       toast?.current?.show('Please connect internet', toastduration);
    //     }
    //   });
    // }
  };

  const renderBottomButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={Login}
        style={{
          backgroundColor: theme.color.button1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          height: 46,
          alignSelf: 'center',
          elevation: 2,
          borderRadius: 6,
          marginVertical: 20,
        }}>
        <Text
          style={{
            color: theme.color.buttonText,
            fontSize: 17,
            fontFamily: theme.fonts.fontBold,
          }}>
          Continue
        </Text>
      </TouchableOpacity>
    );
  };

  const goHome = () => {
    props.navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.color.background}
        barStyle={'dark-content'}
      />
      <utils.Loader text={'Please wait'} load={loader} />

      <View style={styles.header}>
        <View style={styles.back}>
          <TouchableOpacity activeOpacity={0.4} onPress={goBack}>
            <utils.vectorIcon.Ionicons
              name="arrow-back-sharp"
              color={theme.color.subTitle}
              size={26}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 25,
            marginTop: 20,
          }}>
          <utils.vectorIcon.FontAwesome5
            name="phone-square-alt"
            color={theme.color.button1}
            size={50}
          />

          <Text
            style={{
              marginTop: 20,
              fontSize: 18,
              lineHeight: 22,
              color: theme.color.subTitle,
              fontFamily: theme.fonts.fontBold,
            }}>
            Continue with phone number
          </Text>

          <View
            style={[
              styles.MobileInput,
              {
                backgroundColor: d1
                  ? theme.color.disableField
                  : theme.color.background,
              },
            ]}>
            <Image
              source={require('../../assets/images/flag/pakistan.png')}
              style={styles.CountryLogo}
            />

            <Text
              style={{
                fontSize: 12,
                fontFamily: theme.fonts.fontNormal,
                color: theme.color.title,
                top: -1,
              }}>
              +92
            </Text>

            <TextInput
              editable={!d1}
              style={styles.MobileInput2}
              maxLength={10}
              placeholderTextColor={theme.color.subTitle}
              keyboardType="phone-pad"
              placeholder="3123456789"
              value={phone}
              onChangeText={val => {
                setphone(val.replace(/[^0-9]/, ''));
              }}
            />
          </View>
        </View>

        {/* <View
          style={{
            backgroundColor: theme.color.background,
            padding: 15,
            width: responsiveWidth(90),
            alignSelf: 'center',
            marginTop: 30,
            borderRadius: 5,
            elevation: 5,
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: theme.color.subTitle,
              fontFamily: theme.fonts.fontNormal,
            }}>
            Sign in with phone number
          </Text>

        

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',

              marginVertical: 30,
            }}>
            <View
              style={{
                height: 0.5,
                width: '43%',
                backgroundColor: theme.color.subTitle,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: theme.color.subTitle,
                fontFamily: theme.fonts.fontMedium,
              }}>
              OR
            </Text>
            <View
              style={{
                height: 0.5,
                width: '43%',
                backgroundColor: theme.color.subTitle,
              }}
            />
          </View>

          <TextInput
            editable={!d2}
            style={[
              styles.Input,
              {
                backgroundColor: d2
                  ? theme.color.disableField
                  : theme.color.background,
              },
            ]}
            placeholderTextColor={theme.color.subTitle}
            placeholder="Enter your email"
            value={email}
            onChangeText={val => {
              setemail(val);
            }}
          />

          <View
            style={[
              styles.MobileInput,
              {
                marginTop: 15,
                backgroundColor: d2
                  ? theme.color.disableField
                  : theme.color.background,
              },
            ]}>
            <TextInput
              editable={!d2}
              secureTextEntry={!spswd}
              style={styles.pswdInput}
              placeholderTextColor={theme.color.subTitle}
              placeholder="Enter password"
              value={pswd}
              onChangeText={val => {
                setpswd(val);
              }}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setspswd(!spswd)}>
              <utils.vectorIcon.Entypo
                name={!spswd ? 'eye' : 'eye-with-line'}
                color={theme.color.subTitle}
                size={18}
              />
            </TouchableOpacity>
          </View>

        
        </View> */}
      </ScrollView>

      {renderBottomButton()}

      <Toast ref={toast} position="center" />
    </SafeAreaView>
  );
}
