import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
  Dimensions,
  StatusBar,
} from 'react-native';
import styles from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import MapView, {PROVIDER_GOOGLE, Marker, Polygon} from 'react-native-maps';
import {isPointInPolygon} from 'geolib';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import RNGooglePlaces from 'react-native-google-places';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

export default observer(Map);

function Map(props) {
  let mapRef = useRef(null);
  const gapikey = 'AIzaSyC75RWT0q9xkASq2YhX2vGi1R-e_p2pnWU';
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;

  let internet = store.General.isInternet;

  // let loc = props.route.params.loc;
  // const setloc = c => {
  //   props.route.params.setloc(c);
  // };
  const [issetRegion, setissetRegion] = useState(false);

  const [isMapReady, setIsMapReady] = useState(false); //is map is ready check
  // const [coords, setcoords] = useState(loc?.coords || false);

  const [cl, setcl] = useState(false);
  const [loc, setloc] = useState(store.User.location || false);

  const [loader, setloader] = useState(false); //for drop down relted to city

  useEffect(() => {
    Geocoder.init(gapikey, {language: 'en'});
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (isMapReady && cl && !loc) {
      gotoCurrentLoc();
    }
  }, [isMapReady, cl, loc]);

  useEffect(() => {
    if (isMapReady && loc) {
      gotoLoc();
    }
  }, [isMapReady, loc]);

  const googleSearch = () => {
    RNGooglePlaces.openAutocompleteModal(
      {
        initialQuery: '',
        country: 'PK',
        useOverlay: false,
      },
      ['location'],
      // ['placeID', 'location', 'name', 'address', 'plusCode'],
      // ['placeID', 'location', 'name', 'address', 'types', 'openingHours', 'plusCode', 'rating', 'userRatingsTotal', 'viewport']
    )
      .then(place => {
        const data = {
          name: place.name || '',
          address: place.address || '',
          location: {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
          },
        };
        console.log('google places res true : ');
        mapRef?.current?.animateToCoordinate(data.location, 1000);
      })
      .catch(error => {
        if (error.code == 4) {
          Alert.alert(
            '',
            'Please enable billing account on your google map api key',
          );
        }
        console.log('gogole placess error : ', error.message);
      });
  };

  const gotoCurrentLoc = () => {
    setissetRegion(true);
    mapRef?.current?.animateToRegion(
      {
        latitude: cl.coords.latitude,
        longitude: cl.coords.longitude,
        latitudeDelta: LATITUDE_DELTA * Number(30 / 1000),
        longitudeDelta: LONGITUDE_DELTA * Number(30 / 1000),
      },
      1200,
    );
  };

  const gotoLoc = () => {
    mapRef?.current?.animateToRegion(
      {
        latitude: loc.coords.lat,
        longitude: loc.coords.long,
        latitudeDelta: LATITUDE_DELTA * Number(30 / 1000),
        longitudeDelta: LONGITUDE_DELTA * Number(30 / 1000),
      },
      1200,
    );
    setTimeout(() => {
      setissetRegion(true);
    }, 1500);
  };

  const getCurrentLocation = () => {
    setloader(true);
    Geolocation.getCurrentPosition(
      async position => {
        console.log('get c loc one res true');

        const cl = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        const loc = {
          city_name: '',
          country_name: '',
          coords: cl,
        };

        setcl(loc);

        Geocoder.from({
          latitude: cl.latitude,
          longitude: cl.longitude,
        })
          .then(json => {
            setloader(false);
            let results = json.results;
            console.log('geocoder json data true : ');
            let cityName = '';
            let countryName = '';
            if (results[0]) {
              var add = results[0].formatted_address;
              var value = add.split(',');
              let count = value.length;
              let country = value[count - 1];
              let state = value[count - 2];
              let city = value[count - 3];
              cityName = city;
            } else {
              console.log(' geocoder json  res : ', 'address not found');
            }

            const loc = {
              city_name: cityName,
              country_name: countryName,
              coords: cl,
            };

            setloc(loc);

            return;
          })
          .catch(error => {
            setloader(false);
            if (error.code == 4) {
              Alert.alert(
                '',
                'Please enable billing account on your google map api key',
              );
            }
            console.warn('geocoder error : ', error);
            return;
          });
      },
      error => {
        setloader(false);
        if (error.code == 3) {
          if (!cl) {
            getCurrentLocation();
          }
        }

        if (error.code == 1) {
          // locationEnabler()
        }

        console.log('get crnt loc one error : ', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  const getCountryCityName = c => {
    setloader(true);
    Geocoder.from({
      latitude: c.latitude,
      longitude: c.longitude,
    })
      .then(json => {
        setloader(false);
        let results = json.results;
        console.log('geocoder json data true : ');
        let cityName = '';
        let countryName = '';
        if (results[0]) {
          var add = results[0].formatted_address;
          var value = add.split(',');
          let count = value.length;
          let country = value[count - 1];
          let state = value[count - 2];
          let city = value[count - 3];
          cityName = city;
        } else {
          console.log(' geocoder json  res : ', 'address not found');
        }

        const loc = {
          city_name: cityName,
          country_name: countryName,
          coords: c,
        };

        setloc(loc);

        return;
      })
      .catch(error => {
        setloader(false);
        if (error.code == 4) {
          Alert.alert(
            '',
            'Please enable billing account on your google map api key',
          );
        }
        console.warn('geocoder error : ', error);
        return;
      });
  };

  // const confirmLocation = () => {
  //   let point = {lat: coords.latitude, long: coords.longitude};
  //   let obj = {
  //     area: area,
  //     city: city,
  //     coords: point,
  //   };
  //   setloc(obj);
  //   props.route.params.setcity(city);
  //   props.route.params.setarea(area);
  //   props.navigation.goBack();
  // };

  const closeMap = () => {
    props.navigation.goBack();
  };

  const rendercross = () => {
    return (
      <TouchableOpacity style={styles.crossButton} onPress={closeMap}>
        <utils.vectorIcon.Entypo
          name="cross"
          color={theme.color.button1}
          size={27}
        />
      </TouchableOpacity>
    );
  };

  const renderGoogleSearch = () => {
    return (
      <TouchableOpacity style={styles.googleSearchBar} onPress={googleSearch}>
        <utils.vectorIcon.FontAwesome5
          name="search-location"
          color={theme.color.button1}
          size={20}
        />
        <Text style={styles.googleSearchBarText}>Search By Google</Text>
      </TouchableOpacity>
    );
  };

  const renderCurrentLocationIndactor = () => {
    return (
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={gotoCurrentLoc}>
        <utils.vectorIcon.MaterialIcons
          name="my-location"
          color={theme.color.button1}
          size={27}
        />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerPosition}>
        {rendercross()}
        {renderGoogleSearch()}
        {renderCurrentLocationIndactor()}
      </View>
    );
  };

  const renderConfirmButton = () => {
    let text = loader ? 'Loading... ' : 'Confirm';

    return (
      <>
        <TouchableOpacity
          disabled={loader}
          activeOpacity={0.6}
          // onPress={ }
          style={[
            styles.BottomButton,
            {
              backgroundColor: loader
                ? theme.color.disableField
                : theme.color.button1,
            },
          ]}>
          <Text
            style={[
              styles.buttonTextBottom,
              {
                color: loader
                  ? theme.color.disableTextColor
                  : theme.color.buttonText,
              },
            ]}>
            {text}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderCurrentPositionMarker = () => {
    return (
      <Marker
        identifier="current location"
        coordinate={cl.coords}
        pinColor={theme.color.button1}>
        <utils.vectorIcon.Ionicons
          name="md-navigate-circle"
          color={theme.color.button1}
          size={22}
        />
      </Marker>
    );
  };

  const rednerDot = () => {
    return (
      <View style={styles.dotPosition}>
        {!internet && (
          <View style={styles.dotWarningMessage}>
            <Text style={styles.dotWarningMessageText}>
              No internet connection !
            </Text>
          </View>
        )}

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              opacity: 0.8,
              bottom: 5,
              width: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <utils.vectorIcon.MaterialIcons
              name="location-pin"
              color={'red'}
              size={25}
            />
          </View>

          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 6,
              backgroundColor: 'black',
            }}
          />
        </View>
      </View>
    );
  };

  const RegionChangeComplete = e => {
    if (issetRegion) {
      console.log('on region change cal');
      const point = {
        latitude: e.latitude,
        longitude: e.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      getCountryCityName(point);
    }
  };

  console.log('loader : ', loader);
  console.log('loc : ', loc);

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.background}
          barStyle={'dark-content'}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderStatusBar()}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: 33.64186666892545,
          longitude: 73.03620575372447,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsBuildings={true}
        zoomEnabled={true}
        showsCompass={false}
        onMapReady={() => {
          setIsMapReady(true);
        }}
        onRegionChangeComplete={e => {
          RegionChangeComplete(e);
        }}>
        {cl?.coords && renderCurrentPositionMarker()}
      </MapView>
      {renderHeader()}
      {(loc?.coods || cl?.coords) && renderConfirmButton()}
      {rednerDot()}
    </SafeAreaView>
  );
}
