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
  StatusBar,
  Platform,
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
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';

export default observer(Signup);
function Signup(props) {
  const toast = useRef(null);
  const toastduration = 700;

  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;

  let loader = store.User.regLoader;
  const mobileReg = /^[3]\d{9}$/ || /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const [image, setImage] = useState('');
  const [name, setname] = useState('');
  const [phone, setphone] = useState(props.route.params.mobile.slice(3) || '');
  const [email, setemail] = useState(''); //street adress
  const [pswd, setpswd] = useState('');
  const [spswd, setspswd] = useState(false);
  const [rpswd, setrpswd] = useState('');
  const [srpswd, setsrpswd] = useState(false);

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(''); //photo view

  let s = props.route.params.s;

  const goBack = () => {
    props.navigation.goBack();
  };

  const Register = () => {
    if (name == '') {
      toast?.current?.show('Please enter your name');
      return;
    }

    // if (phone == '') {
    //   toast?.current?.show('Please enter your phone number');
    //   return;
    // }

    // if (mobileReg.test(phone) === false) {
    //   toast?.current?.show('Your phone number is inavlid');
    //   return;
    // }

    // if (email == '') {
    //   toast?.current?.show('Please enter your email');
    //   return;
    // }

    // if (emailReg.test(email) === false) {
    //   toast?.current?.show('Please enter correct email');
    //   return;
    // }

    // if (pswd === '') {
    //   toast?.current?.show('Please enter password');
    //   return;
    // }

    // if (pswd.length < 8) {
    //   toast?.current?.show('Password must be minimum 8 characters');
    //   return;
    // }

    // if (rpswd === '') {
    //   toast?.current?.show('Please renter password');
    //   return;
    // }
    // if (pswd !== rpswd) {
    //   toast?.current?.show('Password does not match');
    //   return;
    // }

    const register = {
      username: name,
      mobile: '+92' + phone,
      image: image,
      role: 'customer',
      city: store.User.location.city._id,
      registrationToken: store.User.notificationToken,
      buildNumber: store.General.appBuildNumber,
      versionNumber: store.General.appVersionNumber,
      // password: pswd,
      // email: email.toLowerCase(),
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToRegister(register, goHome, goCheckout, s);
        // store.User.attempToPlaceOrder(order, showSuccesOrder);
      } else {
        toast?.current?.show('Please connect internet', toastduration);
      }
    });
  };

  const goHome = () => {
    props.navigation.navigate('Home');
  };

  const goCheckout = () => {
    props.navigation.navigate('Checkout', {s: s});
  };

  const MultipleImage = async button => {
    Keyboard.dismiss();

    try {
      let options = {
        mediaType: 'image',
        isPreview: false,
        singleSelectedMode: true,
      };
      const res = await MultipleImagePicker.openPicker(options);
      if (res) {
        console.log('mutipicker image res true  ');
        const {path, fileName, mime} = res;
        let uri = path;
        if (Platform.OS == 'android' && store.General.apiLevel < 29) {
          uri = 'file://' + uri;
        }

        ImageCompressor.compress(uri, {
          compressionMethod: 'auto',
        })
          .then(async res => {
            let imageObject = {
              uri: res,
              type: mime,
              fileName: fileName,
            };
            console.log('Compress image  : ', imageObject);
            if (button == 'Profile') {
              setImage(imageObject);
            } else {
              return;
            }
          })
          .catch(err => {
            console.log('Image compress error : ', err);
          });
      }
    } catch (error) {
      console.log('multi photo picker error : ', error);
    }
  };

  const onclickImage = c => {
    Keyboard.dismiss();

    if (c == 'profileV') {
      setpv(image.uri);
      setpvm(true);
      return;
    }

    MultipleImage(c);
  };

  const renderBottomButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={loader}
        onPress={Register}
        style={{
          backgroundColor: theme.color.button1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          alignSelf: 'center',
          height: 46,
          elevation: 2,
          borderRadius: 6,
          marginVertical: 25,
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

  const renderFullImage = () => {
    return (
      <Modal
        visible={pvm}
        transparent
        onRequestClose={() => {
          setpvm(false);
          setpv('');
        }}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <Image
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            resizeMode="contain"
            source={{uri: pv}}
          />

          <TouchableOpacity
            onPress={() => {
              setpvm(!pvm);
              setpv('');
            }}
            style={styles.fullImageModalCross}>
            <utils.vectorIcon.Entypo name="cross" color="white" size={35} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderFullImage()}
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
          <View style={styles.Profile}>
            <View style={styles.ProfileImageContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Keyboard.dismiss();
                  if (image != '') {
                    onclickImage('profileV');
                  }
                }}>
                <Image
                  style={styles.ProfileImage}
                  source={
                    image != ''
                      ? {uri: image.uri}
                      : require('../../assets/images/profile/profileimage.png')
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => {
                  onclickImage('Profile');
                }}
                style={styles.ImageUploadConatiner}>
                <utils.vectorIcon.Ionicons
                  name="ios-camera"
                  color={'black'}
                  size={19}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={{
              marginTop: 20,
              fontSize: 18,
              lineHeight: 22,
              color: theme.color.subTitle,
              fontFamily: theme.fonts.fontBold,
            }}>
            Let’s create your account!
          </Text>

          <View style={styles.MobileInput}>
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
              editable={false}
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

          <TextInput
            style={styles.Input}
            placeholderTextColor={theme.color.subTitle}
            placeholder="Enter your name"
            value={name}
            onChangeText={val => {
              setname(val);
            }}
          />
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
          <View style={styles.Profile}>
            <View style={styles.ProfileImageContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Keyboard.dismiss();
                  if (image != '') {
                    onclickImage('profileV');
                  }
                }}>
                <Image
                  style={styles.ProfileImage}
                  source={
                    image != ''
                      ? {uri: image.uri}
                      : require('../../assets/images/profile/profileimage.png')
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  onclickImage('Profile');
                }}
                style={styles.ImageUploadConatiner}>
                <utils.vectorIcon.Ionicons
                  name="ios-camera"
                  color={'black'}
                  size={19}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.Input}
            placeholderTextColor={theme.color.subTitle}
            placeholder="Enter your name"
            value={name}
            onChangeText={val => {
              setname(val);
            }}
          />

          <View style={styles.MobileInput}>
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

          <TextInput
            style={styles.Input}
            placeholderTextColor={theme.color.subTitle}
            placeholder="Enter your email"
            value={email}
            onChangeText={val => {
              setemail(val);
            }}
          />

          <View style={styles.MobileInput}>
            <TextInput
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

          <View style={styles.MobileInput}>
            <TextInput
              secureTextEntry={!srpswd}
              style={styles.pswdInput}
              placeholderTextColor={theme.color.subTitle}
              placeholder="Re-enter password"
              value={rpswd}
              onChangeText={val => {
                setrpswd(val);
              }}
            />

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setsrpswd(!srpswd)}>
              <utils.vectorIcon.Entypo
                name={!srpswd ? 'eye' : 'eye-with-line'}
                color={theme.color.subTitle}
                size={18}
              />
            </TouchableOpacity>
          </View>

         
        </View> */}
      </ScrollView>

      {renderBottomButton()}

      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
