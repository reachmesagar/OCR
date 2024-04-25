/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {RNCamera} from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [state, setState] = useState<{
    loading: boolean;
    image: string | null;
    toast: {
      message: string;
      isVisible: boolean;
    };
    textRecognition: [] | null;
  }>({
    loading: false,
    image: null,
    textRecognition: null,
    toast: {
      message: '',
      isVisible: false,
    },
  });

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        let r = await launchCamera({
          mediaType: 'photo',
          includeBase64: false,
          saveToPhotos: true,
          quality: 0.5,
        });
        console.log('RESULT', r);

        if (r && r.assets) {
          onImageSelect({
            assets: [
              {
                uri:
                  r.assets && r.assets.length > 0
                    ? r.assets[0].uri
                    : 'https://as1.ftcdn.net/v2/jpg/01/33/65/52/1000_F_133655220_mNV6Ymdpfe4UO3dv3OkqEwLaRNyLEhYr.jpg',
              },
            ],
          });
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  async function onPress(type: 'capture' | 'library') {
    setState({...state, loading: true});
    console.log('type', type);
    if (type === 'capture') {
      requestCameraPermission();
      // let x = await launchCamera({
      //   mediaType: 'photo',
      //   includeBase64: false,
      //   saveToPhotos: true,
      //   quality: 0.5,
      // });
      // console.log('RESULT', x);
    } else {
      let r = await launchImageLibrary({mediaType: 'photo'});
      console.log('IIII', r);
      if (r && r.assets) {
        onImageSelect({
          assets: [
            {
              uri:
                r.assets && r.assets.length > 0
                  ? r.assets[0].uri
                  : 'https://as1.ftcdn.net/v2/jpg/01/33/65/52/1000_F_133655220_mNV6Ymdpfe4UO3dv3OkqEwLaRNyLEhYr.jpg',
            },
          ],
        });
      }
    }
    // type === 'capture'
    //   ? () => {
    //       let x = launchCamera({mediaType: 'photo'});
    //       console.log('RESULT', x);
    //     }
    //   : () => {
    //       let r = launchImageLibrary({mediaType: 'photo'});
    //       console.log('IIII', r);
    //     };
  }

  async function onImageSelect(media: {assets: [{uri: string}]}) {
    console.log('selecting', media);

    if (!media) {
      setState({...state, loading: false});
      return;
    }

    if (!!media && media.assets) {
      const file = media.assets[0].uri;
      const textRecognition = await RNTextDetector.detectFromUri(file);

      console.log('PPPPP', textRecognition);

      const INFLIGHT_IT = 'Inflight IT';
      //if match toast will appear
      const matchText = textRecognition.findIndex((item: {text: string}) =>
        item.text.match(INFLIGHT_IT),
      );
      setState({
        ...state,
        textRecognition,
        image: file,
        toast: {
          message: matchText > -1 ? 'Ohhh i love this company!!' : '',
          isVisible: matchText > -1,
        },
        loading: false,
      });
    }
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView
    // style={styles.container}
    >
      <ScrollView
        style={{
          paddingBottom: 200,
        }}>
        <View
        //  style={styles.content}
        >
          <Text
          // style={styles.title}
          >
            RN OCR SAMPLE
          </Text>
          <View>
            <TouchableOpacity
              style={{
                padding: 20,
                backgroundColor: 'blue',
                margin: 20,
              }}
              // style={[styles.button, styles.shadow]}
              onPress={() => onPress('capture')}>
              <Text
                style={{
                  color: 'white',
                }}>
                Take Photo
              </Text>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                style={{
                  padding: 20,
                  backgroundColor: 'blue',
                  margin: 20,
                }}
                // style={[styles.button, styles.shadow]}
                onPress={() => onPress('library')}>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  Pick a Photo
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <View style={{alignItems: 'center'}}>
                <Image
                  style={{
                    height: 100,
                  }}
                  // style={[styles.image, styles.shadow]}
                  source={{
                    uri: state.image
                      ? state.image
                      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZNGnkTzaYc1ymi3ZQSa3FpUcqdM5iRihRzYCLCu_25A&s',
                  }}
                />
              </View>

              {!!state.textRecognition &&
                state.textRecognition.map((item: {text: string}, i: number) => (
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 30,
                    }}
                    key={i}>
                    {item.text}
                  </Text>
                ))}

              {/* <WrapLoading loading={state.loading}>
            </WrapLoading> */}
            </View>
          </View>
          {state.toast.isVisible &&
            ToastAndroid.showWithGravityAndOffset(
              state.toast.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            )}
        </View>
      </ScrollView>
    </SafeAreaView>

    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar
    //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    //     backgroundColor={backgroundStyle.backgroundColor}
    //   />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     style={backgroundStyle}>
    //     <Header />
    //     <View
    //       style={{
    //         backgroundColor: isDarkMode ? Colors.black : Colors.white,
    //       }}>
    //       <Section title="Step One">
    //         Edit <Text style={styles.highlight}>App.tsx</Text> to change this
    //         screen and then come back to see your edits.
    //       </Section>
    //       <Section title="See Your Changes">
    //         <ReloadInstructions />
    //       </Section>
    //       <Section title="Debug">
    //         <DebugInstructions />
    //       </Section>
    //       <Section title="Learn More">
    //         Read the docs to discover what to do next:
    //       </Section>
    //       <LearnMoreLinks />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
