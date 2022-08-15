import {StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  headerConatainer: {
    backgroundColor: theme.color.background,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  locContainer: {
    width: '70%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  locText: {
    fontSize: 14,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  locText2: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  boxContainer: {
    width: '100%',
    height: responsiveHeight(20),
    backgroundColor: '#FFC5B2',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  boxContainer2: {
    width: '100%',
    height: responsiveHeight(20),
    backgroundColor: '#FEF0C0',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  boxContainerSecton1: {
    width: '55%',

    justifyContent: 'flex-end',
  },

  boxContainerSecton2: {
    width: '40%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  bcs1Text1: {
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
  },

  bcs1Text2: {
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.title,
  },
  bcs2Image: {flex: 1, resizeMode: 'contain', elevation: 5},
});
