import { View,Text, SafeAreaView, Image } from "react-native";
import React  from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function Features() {
  return(
    <View style={{height:hp(60)}} className="space-y-4">
        <Text style={{fontSize:wp(6.5)}} className="font-semibold text-gray-700">Features</Text>
        <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
            <View className="flex-row items-center space-x-1">
                <Image source={require('../../assets/images/chatgpt-icon.png')} style={{height:hp(4), width:hp(4)}} />
                <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700" >ChatGPT</Text>
            </View>
            <Text style={{fontSize:wp(3.8) }}className="text-gray-700 font-medium">ChatGPT is defined as a conversational AI model that uses a machine learning framework to communicate and generate intuitive responses to human inputs</Text>
        </View>
        <View className="bg-purple-200 p-4 rounded-xl space-y-2">
            <View className="flex-row items-center space-x-1">
                <Image source={require('../../assets/images/openai-icon.png')} style={{height:hp(4), width:hp(4)}} />
                <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700" >DALL-E</Text>
            </View>
            <Text style={{fontSize:wp(3.8) }}className="text-gray-700 font-medium">DALL-E is a neural network and works on a transformer model. This model works on handling input data and making highly flexible data to run the various task o generative.</Text>
        </View>
        <View className="bg-cyan-200 p-4 rounded-xl space-y-2">
            <View className="flex-row items-center space-x-1">
                <Image source={require('../../assets/images/brain_9235785.png')} style={{height:hp(5), width:hp(4)}} />
                <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700" >Smart AI</Text>
            </View>
            <Text style={{fontSize:wp(3.8)}}className="text-gray-700 font-medium">A powerful voice assistant with abilities of ChatGPT and DALL-E, providing you the best of both worlds.</Text>
        </View>
        
    </View>
    
  )
} 