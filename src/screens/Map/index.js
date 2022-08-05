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

export default observer(Map);

function Map(props) {
  let mapRef = useRef(null);
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;
  let cl = store.User.cl;
  let internet = store.General.isInternet;

  // let CityAreaData = store.User.CityAreaData;
  // let cityList = props.route.params.citylist;
  let citydata = props.route.params.city;
  let areadata = props.route.params.area;
  let loc = props.route.params.loc;
  const setloc = c => {
    props.route.params.setloc(c);
  };

  const [issetRegion, setissetRegion] = useState(false);
  const [isNoarea, setisNoarea] = useState(false); //rate captain sheet

  const [isMapReady, setIsMapReady] = useState(false); //is map is ready check
  const [coords, setcoords] = useState(loc.coords);
  const [polygons, setpolygons] = useState([]);

  const [city, setcity] = useState(citydata);
  const [area, setarea] = useState(areadata);

  useEffect(() => {
    if (isMapReady) {
      if (loc) {
        gotoLoc(loc);
      } else {
        gotoCurrentLoc();
      }
    }
  }, [isMapReady]);

  useEffect(() => {
    let p = store.User.polygons;

    let arr = [];
    if (p.length > 0) {
      p.map((e, i, a) => {
        const obj = {...e};

        const latlngs = [];
        if (e.latlngs.length > 0) {
          e.latlngs.map((e, i, a) => {
            latlngs.push(e);
          });
        }
        delete obj.latlngs;
        obj.latlngs = latlngs;
        arr.push(obj);
      });
    }

    // const arr = [
    //   {
    //     _id: '62a71c1660c725018ef15ce7',
    //     latlngs: [
    //       {latitude: 33.63891386206431, longitude: 73.03883794745066},
    //       {latitude: 33.6442132898169, longitude: 73.04962698072997},
    //       {latitude: 33.62961662037574, longitude: 73.0539425940417},
    //       {latitude: 33.626337643598, longitude: 73.04719944824213},
    //       {latitude: 33.638958773839335, longitude: 73.03894583778344},
    //     ],
    //   },

    //   {
    //     _id: '62a852d924721fd629e9cac2',
    //     latlngs: [
    //       {latitude: 33.646497272600904, longitude: 72.97975958876502},
    //       {latitude: 33.65428514823183, longitude: 72.99546660533794},
    //       {latitude: 33.64199570206093, longitude: 73.0045646586534},
    //       {latitude: 33.63413525274612, longitude: 72.98868598069717},
    //     ],
    //   },
    // ];

    setpolygons(arr);
  }, [store.User.polygons]);

  const closeMap = () => {
    props.navigation.goBack();
  };

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
    mapRef?.current?.animateToRegion(
      {
        latitude: cl.coords.latitude,
        longitude: cl.coords.longitude,
        latitudeDelta: LATITUDE_DELTA * Number(30 / 1000),
        longitudeDelta: LONGITUDE_DELTA * Number(30 / 1000),
      },
      1200,
    );
    // setTimeout(() => {
    //   setissetRegion(true);
    // }, 1500);
  };

  const gotoLoc = l => {
    mapRef?.current?.animateToRegion(
      {
        latitude: l.coords.lat,
        longitude: l.coords.long,
        latitudeDelta: LATITUDE_DELTA * Number(30 / 1000),
        longitudeDelta: LONGITUDE_DELTA * Number(30 / 1000),
      },
      1200,
    );
    setTimeout(() => {
      setissetRegion(true);
    }, 1500);
  };

  const ISPointInPolygon = point => {
    if (polygons.length > 0) {
      for (let index = 0; index < polygons.length; index++) {
        const e = polygons[index];
        let p = e.latlngs.length;

        if (p > 0) {
          const c = isPointInPolygon(point, e.latlngs);
          console.log('is region in polygons : ', c);
          if (c) {
            setisNoarea(false);
            setcoords(point);
            setcity(e.city);
            setarea(e.area);
            break;
          }
          setisNoarea(true);
        }
      }
    }
  };

  const confirmLocation = () => {
    let point = {lat: coords.latitude, long: coords.longitude};
    let obj = {
      area: area,
      city: city,
      coords: point,
    };
    setloc(obj);
    props.route.params.setcity(city);
    props.route.params.setarea(area);
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

  const renderFooter = () => {
    let are = !isNoarea ? area.name : 'Oops!';
    let cit = !isNoarea
      ? city.name
      : 'This location is outside of our service area.';

    return (
      <View style={styles.BottomView}>
        <View style={styles.section1Container}>
          <View style={styles.section11}>
            <utils.vectorIcon.Entypo
              name="location-pin"
              color={theme.color.button1}
              size={37}
            />
          </View>

          <View style={styles.section12}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.section12TextTitle}>
              {are}
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.section12TextSubTitle}>
              {cit}
            </Text>
          </View>
        </View>

        {!isNoarea && (
          <TouchableOpacity
            onPress={confirmLocation}
            disabled={isNoarea}
            activeOpacity={0.6}
            style={styles.section2}>
            {/* <LinearGradient
              colors={[theme.color.button1, theme.color.button2]}
              style={styles.LinearGradient}> */}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.section2Text}>
              confirm location
            </Text>
            {/* </LinearGradient> */}
          </TouchableOpacity>
        )}
      </View>
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
      const point = {latitude: e.latitude, longitude: e.longitude};
      ISPointInPolygon(point);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        {polygons.length > 0 &&
          polygons.map(polygon => (
            <Polygon
              key={polygon._id}
              coordinates={polygon.latlngs}
              fillColor="rgba(0,0,0,0.1)"
              strokeColor="silver"
            />
          ))}
        {cl && renderCurrentPositionMarker()}
      </MapView>
      {renderHeader()}
      {renderFooter()}
      {coords && rednerDot()}
    </SafeAreaView>
  );
}
