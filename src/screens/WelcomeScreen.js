import { View,Text, SafeAreaView, Image, Button, TouchableOpacity } from "react-native";
import React  from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return(
    <SafeAreaView className='flex-1 flex justify-around bg-white'>
      <View className="space-y-2">
        <Text style={{fontSize: wp(10)}} className="text-center font-bold text-gray-700">Donna</Text>
        <Text style={{fontSize: wp(4)}} className="text-center tracking-wider font-semibold text-gray-600">The Future is here, powered by AI.</Text>
      </View>
      <View className="flex-row justify-center">
        <Image source={require('../../assets/images/bot_4712129.png')} style={{width: wp(60),height:wp(60)}} ></Image>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('Home')} className="bg-slate-800 mx-5 p-4 rounded-2xl">
        <Text style={{fontSize:wp(6)}} className="text-center font-bold text-white">Get Started</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}