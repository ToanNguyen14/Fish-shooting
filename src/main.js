import React, { useRef, useState, useEffect } from "react";
import { Platform, AppState } from 'react-native';
import { WebView } from 'react-native-webview';
import { InterstitialAd, TestIds, AdEventType } from '@react-native-firebase/admob';
import AsyncStorage from '@react-native-async-storage/async-storage';
const rewardedAdUnitId = "ca-app-pub-5425858352547326/7879382681";
export default function Main() {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    let showAdsNext = '1';
    const _storeData = async (ishow) => {
        try {
            await AsyncStorage.setItem('showAdNextStore', ishow);
        } catch (error) {
            // Error saving data
        }
    };
    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            AsyncStorage.getItem("showAdNextStore").then((value) => {
                if (value !== null) {
                    console.log("value:" + value);
                    showAdsNext = value;
                }
                else {
                    showAdsNext = '1';
                }
            })
                .then(res => {
                    console.log("showAdsNext:" + showAdsNext);
                    if (
                        appState.current.match(/inactive|background/) &&
                        nextAppState === "active"
                    ) {

                        //showRewardAd();
                    }
                    appState.current = nextAppState;
                    setAppStateVisible(appState.current);
                    if (
                        appState.current.match(/active/) && showAdsNext === '1'
                    ) {
                        _storeData('0');
                        showAdsNext = '0';
                        showInterstitialAd();
                    }
                    else if (
                        appState.current.match(/active/) && showAdsNext === '0'
                    ) {
                        _storeData('1');
                        showAdsNext = '1';
                    }
                    console.log("3.showAdsNext:", showAdsNext);
                });
        });

        return () => {
            subscription.remove();
        };
    }, []);
    showInterstitialAd = () => {
        // Create a new instance
        const interstitialAd = InterstitialAd.createForAdRequest(rewardedAdUnitId);

        // Add event handlers
        interstitialAd.onAdEvent((type, error) => {
            if (type === AdEventType.LOADED) {
                interstitialAd.show();
            }
        });

        // Load a new advert
        interstitialAd.load();
    }
    if (Platform.OS === 'ios') {
        var urlios = require("../assets/index.html");
        return (
            <>
                <WebView
                    style={{ flex: 1 }}
                    originWhitelist={['*']}
                    source={urlios}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowUniversalAccessFromFileURLs={true}
                    allowFileAccessFromFileURLs={true}
                    javaScriptCanOpenWindowsAutomatically={true}
                    allowsInlineMediaPlayback={true}
                />
                {/* <BannerAd
                    unitId='ca-app-pub-5425858352547326/1966753406'
                    size={BannerAdSize.FULL_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                    onAdLoaded={() => {
                        console.log('Advert loaded');
                    }}
                    onAdFailedToLoad={(error) => {
                        console.error('Advert failed to load: ', error);
                    }}
                /> */}
            </>
        );
    }
    else {
        return (
            <>
                <WebView
                    style={{ flex: 1 }}
                    originWhitelist={['*']}
                    source={{ uri: 'file:///android_asset/index.html' }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowUniversalAccessFromFileURLs={true}
                    allowFileAccessFromFileURLs={true}
                    javaScriptCanOpenWindowsAutomatically={true}
                />
                {/* <BannerAd
                    unitId='ca-app-pub-4794354256210815/9701070866'
                    size={BannerAdSize.SMART_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                    onAdLoaded={() => {
                        console.log('Advert loaded');
                    }}
                    onAdFailedToLoad={(error) => {
                        console.error('Advert failed to load: ', error);
                    }}
                /> */}
            </>
        )
    }
}