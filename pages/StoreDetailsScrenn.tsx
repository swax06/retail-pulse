import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import storage from '@react-native-firebase/storage';
import { useRoute } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const StoreDetailsScrenn = () => {
    const params: any = useRoute().params;
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [imageList, setImageList] = useState<any[]>([]);

    useEffect(() => {
        loadImageList();
    }, []);

    const loadImageList = () => {
        const reference = storage().ref(`/images/${params.storeData?.id}`);
        reference.list().then(result => {
            setImageList(result.items);
        });
    }

    return (
        <>
            <View>
                <View style={{ flexDirection: 'row', justifyContent:'space-between', margin: 5 }}>
                    <View style={{width: '70%'}}>
                        <Text variant='headlineMedium'>{params.storeData?.name}</Text>
                        <Text variant='bodyMedium'>{params.storeData?.address}</Text>
                        <Text variant='labelLarge'>{params.storeData?.area}</Text>
                        <Text variant='bodyMedium'>{params.storeData?.route}</Text>
                    </View>
                    
                    <Button style={{height: 45}} onPress={loadImageList} mode='contained'>Refresh</Button>
                </View>

                {imageList.map((x: any) => (
                    <Text key={x.name} variant='bodyLarge'>{x.name}</Text>
                ))}
                <Button style={{margin: 10, marginTop: 'auto'}} onPress={() => navigation.navigate('Camera', params)} mode='elevated'>Add Store Image</Button>
            </View>
        </>
    )
}

export default StoreDetailsScrenn

const styles = StyleSheet.create({})