import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import ImageSlider from 'react-native-image-slider';

export default observer(ResturantDetails);
function ResturantDetails(props) {
  const rbSheet = useRef(null);
  let maxItem = 5;

  const [num, setNum] = useState(1);

  const windowWidth = theme.window.Width;
  const imageAspectWidth = 375;
  const imageAspectHeight = 332;
  const curveAdjustment = 10;
  const maskHeight = responsiveHeight(28);
  const scaleFactor = imageAspectWidth / imageAspectHeight;
  const scaledHeight = scaleFactor * maskHeight;
  const controlPointX = windowWidth / 2.0;
  const controlPointY = scaledHeight + curveAdjustment;
  const curveCenterPointY = (controlPointY - maskHeight) / 2;

  const toast = useRef(null);
  const toastduration = 700;

  let cart = store.User.cart;

  let sliderImages = store.Food.sliderImages;
  const [img, setImg] = useState(
    sliderImages.appCover ? sliderImages.appCover : [],
  );

  const resturant = store.User.rd;
  let name = resturant.name || '';
  // let avgRate = resturant.rating.average_rating || 0;
  // let totalRaters = resturant.rating.total_reviews || 0;
  let address = resturant.loc.address || '';
  let times = resturant.opening_times || [];

  const goBack = () => {
    props.navigation.goBack();
  };

  const renderTitleSection = () => {
    const renderSep = () => {
      return (
        <View
          style={{
            width: 0,
            height: 15,
          }}
        />
      );
    };

    const renderTimes = () => {
      const t = times.map((e, i, a) => {
        let title = e.day || '';
        let ft = e.open || '';
        let st = e.close || '';
        let fnlt = ft != '' && st != '' ? ft + ' - ' + st : '';

        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.subTitle,
                lineHeight: 22,
                textTransform: 'capitalize',
              }}>
              {title}
            </Text>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.subTitleLight,
                lineHeight: 22,
                textTransform: 'capitalize',
              }}>
              {fnlt != '' ? fnlt : 'Close'}
            </Text>
          </View>
        );
      });

      return t;
    };

    const navigatetoGoogleMaps = () => {
      let label = resturant.name;

      let dest = resturant.loc.coords;

      let latLng = `${dest.latitude},${dest.longitude}`;

      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });

      const url = Platform.select({
        ios: `${scheme}${label}&ll=${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.canOpenURL(url)
        .then(supported => {
          console.log('start google map support', supported);
          if (supported) {
            return Linking.openURL(url);
          } else {
            const browser_url =
              Platform.OS == 'ios'
                ? `https://www.google.de/maps/@${latLng}?q=${label}`
                : `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${latLng}`;
            return Linking.openURL(browser_url);
          }
        })
        .catch(err => {
          console.log('error open google map', err);
          Alert.alert('', err);
        });
    };

    let sty = {
      paddingHorizontal: 15,
      marginBottom: 15,
      backgroundColor: theme.color.background,
    };

    return (
      <View style={sty}>
        {renderSep()}
        <View style={{width: '100%'}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 18,
              fontFamily: theme.fonts.fontBold,
              color: theme.color.title,
              textTransform: 'capitalize',
              lineHeight: 22,
            }}>
            {name}
          </Text>
        </View>
        {renderSep()}
        {/* <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <utils.vectorIcon.Entypo
            name="star-outlined"
            color={theme.color.button1}
            size={22}
          />
          <View style={{width: '92%'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 15,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.subTitle,
                textTransform: 'capitalize',
                lineHeight: 22,
              }}>
              {avgRate}
            </Text>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.subTitleLight,
                lineHeight: 22,
              }}>
              {totalRaters} people rated
            </Text>
          </View>
        </View>
        {renderSep()} */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <utils.vectorIcon.Ionicons
            name="ios-location-outline"
            color={theme.color.button1}
            size={22}
          />
          <View style={{width: '92%'}}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={navigatetoGoogleMaps}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 15,
                  fontFamily: theme.fonts.fontMedium,
                  color: theme.color.subTitle,
                  lineHeight: 22,
                }}>
                {address}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderSep()}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <utils.vectorIcon.Ionicons
            name="time-outline"
            color={theme.color.button1}
            size={22}
          />
          <View style={{width: '92%', paddingRight: 15}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 15,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.subTitle,
                lineHeight: 22,
              }}>
              Opening times
            </Text>
            {times.length > 0 && renderTimes()}
            {times.length <= 0 && (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 15,
                  fontFamily: theme.fonts.fontMedium,
                  color: theme.color.subTitleLight,
                  lineHeight: 22,
                }}>
                Null
              </Text>
            )}
          </View>
        </View>
        {renderSep()}
      </View>
    );
  };

  const sep = () => {
    return (
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          height: 1.5,
          backgroundColor: theme.color.subTitle,
          marginTop: 15,
          opacity: 0.1,
        }}
      />
    );
  };

  const renderStatusBar = () => {
    return (
      <StatusBar
        translucent={Platform.OS == 'ios' ? false : true}
        backgroundColor={
          Platform.OS == 'ios' ? theme.color.background : 'transparent'
        }
        barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
      />
    );
  };

  // const renderCoverImage = () => {
  //   return (

  //     // <View style={styles.imageConatiner}>
  //     //   <TouchableOpacity
  //     //     activeOpacity={0.5}
  //     //     onPress={() => {
  //     //       setfullImgUri(image);
  //     //       setfullImgModal(true);
  //     //     }}>
  //     //     <FastImage
  //     //       style={styles.image}
  //     //       source={image}
  //     //       resizeMode={FastImage.resizeMode.cover}
  //     //     />
  //     //   </TouchableOpacity>
  //     // </View>
  //   );
  // };

  const renderImageSliderBoxIos = () => {
    return (
      <MaskedView
        style={[
          styles.mask,
          {
            height: controlPointY - curveCenterPointY,
          },
        ]}
        maskElement={
          <Svg height="100%" width="100%">
            <Path
              d={`M0 0 L${windowWidth} 0 L${windowWidth} ${maskHeight} Q${controlPointX} ${controlPointY} 0 ${maskHeight} Z`}
              fill={'#fff'}
            />
          </Svg>
        }>
        <ImageSlider
          autoPlayWithInterval={2000}
          images={img}
          style={{
            backgroundColor: theme.color.background,
            elevation: 5,
          }}
          customSlide={({index, item, style, width}) => (
            <TouchableOpacity
              style={style}
              activeOpacity={0.7}
              disabled
              key={index}>
              <FastImage
                style={{
                  flex: 1,
                  resizeMode: 'stretch',
                }}
                source={{
                  uri: item,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          )}
        />
      </MaskedView>
    );
  };

  const renderImageSliderBoxAndroid = () => {
    return (
      <View style={styles.imageConatiner}>
        <ImageSlider
          autoPlayWithInterval={2000}
          images={img}
          style={{
            backgroundColor: theme.color.background,
            elevation: 5,
          }}
          customSlide={({index, item, style, width}) => (
            <TouchableOpacity
              style={style}
              activeOpacity={0.7}
              disabled
              key={index}>
              <FastImage
                style={{
                  flex: 1,
                  resizeMode: 'stretch',
                }}
                source={{
                  uri: item,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.icon}
          activeOpacity={0.6}
          onPress={goBack}>
          <utils.vectorIcon.Ionicons
            name="ios-chevron-back-sharp"
            color={theme.color.button1}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled
          activeOpacity={0.6}
          // onPress={() => onPressHeart(!isFav ? 'add' : 'remove')}
          style={styles.icondisable}>
          {/* <utils.vectorIcon.AntDesign
          name={!isFav ? 'hearto' : 'heart'}
          color={theme.color.heart}
          size={23}
        /> */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderStatusBar()}
      {/* <View>{renderCoverImage()}</View> */}
      <View>
        {Platform.OS == 'android'
          ? renderImageSliderBoxAndroid()
          : renderImageSliderBoxIos()}
        {renderTitleSection()}
      </View>
      {renderHeader()}
      {/* <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsVerticalScrollIndicator={false}>
        {renderTitleSection()}
        {sep()}

        {(baseV.length > 0 || addV.length > 0) && renderVariantSection()}

        {renderProductAvailability()}
      </ScrollView>
      {renderFullImage()} */}

      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
