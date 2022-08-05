import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
   backgroundColor:theme.color.button1
  },
 
  logo: {
   marginTop:55
  },
  title: {
    fontSize: 26,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.background,
  
  },
  Description: {
    fontSize: 17,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.background,
  letterSpacing:1,
  lineHeight:30
  },
  Body: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
     
    padding:20
  },
  ContinueButton: {
    backgroundColor: theme.color.background,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  
  },
  ContinueButtonText: {
    alignSelf: 'center',
    color: theme.color.title,
    lineHeight: 20,
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
  },
  LinearGradient: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:theme.color.button1
  },
});

export default styles;