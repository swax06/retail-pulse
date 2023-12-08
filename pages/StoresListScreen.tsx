import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const usersCollection = firestore().collection('Users');
const storesCollection = firestore().collection('Stores');

const StoreCard = ({ store }: { store: any }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('StoreDetails', {storeData: store})}>
      <Surface style={styles.card} elevation={2}>
        <Text variant='labelLarge'>{store.name}</Text>
        <Text variant='bodyMedium'>{store.address}</Text>
        <Text variant='labelLarge'>{store.area}</Text>
        <Text variant='bodyMedium'>{store.route}</Text>
      </Surface >
    </TouchableOpacity>

  )
}

const filterStateInfo = {
  area: {
    name: 'Area',
    possibleValuues: [],
    dropDownShown: false,
    selectedValue: undefined
  },
  type: {
    name: 'Type',
    possibleValuues: [],
    dropDownShown: false,
    selectedValue: undefined
  },
  route: {
    name: 'Route',
    possibleValuues: [],
    dropDownShown: false,
    selectedValue: undefined
  }
};

const StoresListScreen = () => {
  const [batch, setBatch] = useState(1);
  const [userName, setUserName] = useState('');
  const [storeList, setStoreList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [globalStoreList, setGlobalStoreList] = useState<any[]>([]);
  const [filterState, setFilterState] = useState(filterStateInfo);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    const list = globalStoreList
      .filter(x => {
        return !!search ? x.name.toLowerCase().includes(search.toLowerCase()) : true;
      })
      .filter(x => {
        let filter = true;
        Object.entries(filterState).forEach(([key, state]) => {
          filter = filter && (!!state.selectedValue ? state.selectedValue === x[key] : true);
        })
        return filter;
      })
      .sort((storeA: any, storeB: any) => storeA.name > storeB.name ? 1 : -1)
      // .splice((batch - 1) * 15, batch * 15);
    setStoreList(list);
  }, [batch, search, globalStoreList, filterState]);

  const onAuthStateChanged = async (user: any) => {
    setLoading(true);
    if (!!user) {
      const userData = await usersCollection.doc(user.uid).get();
      const storeIdSet = new Set(userData.data()?.stores);
      setUserName(userData.data()?.name);
      const querySnapshot = await storesCollection.get();
      const storeData: any[] = [];
      querySnapshot.forEach(documentSnapshot => {
        if (!!storeIdSet.has(documentSnapshot.id))
          storeData.push({ ...documentSnapshot.data(), id: documentSnapshot.id })
      });
      const initFilterState: any = { ...filterStateInfo };
      Object.entries(filterStateInfo).forEach(([key, filterState]) => {
        initFilterState[key].possibleValuues = [{ label: 'All', value: null }, ...Object.keys(storeData.reduce((x, y) => {
          (x[y[key]] = x[y[key]] || []).push(y);
          return x;
        }, {})).map(x => ({ label: x, value: x }))];
      });
      setFilterState(initFilterState);
      setGlobalStoreList(storeData);
    }
    else {
      setGlobalStoreList([]);
    }
    setLoading(false);
  }

  const setShowDropDown = (key: string, state: boolean) => {
    setFilterState((prev: any) => {
      return { ...prev, [key]: { ...prev[key], dropDownShown: state } };
    })
  }

  const setFilterValue = (key: string, value: string) => {
    setFilterState((prev: any) => {
      return { ...prev, [key]: { ...prev[key], selectedValue: value } };
    })
  }

  return (
    <>
      <View style={{ height: 200, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', margin: 5 }}>
          <Text variant='headlineMedium'>{userName}</Text>
          <Button style={styles.logout} mode='contained' onPress={() => auth().signOut()}>Logout</Button>
        </View>
        <TextInput
          label="Search Store Name"
          mode='outlined'
          textContentType='organizationName'
          value={search}
          style={styles.textBox}
          onChangeText={text => setSearch(text)}
        />

        <ScrollView
          horizontal={true}>
          {
            Object.entries(filterState).map(([key, x]) =>
              <View key={key} style={{ margin: 3 }}>
                <DropDown
                  label={x.name}

                  mode={"outlined"}
                  visible={x.dropDownShown}
                  showDropDown={() => setShowDropDown(key, true)}
                  onDismiss={() => setShowDropDown(key, false)}
                  value={x.selectedValue}
                  setValue={(val) => setFilterValue(key, val)}
                  list={x.possibleValuues}
                />
              </View>
            )
          }
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        {!loading &&
          <FlatList
            data={storeList}
            keyExtractor={(x) => x.id}
            contentContainerStyle={{ paddingHorizontal: '3%' }}
            ListFooterComponent={() => <View style={{ height: '10%' }} />}
            renderItem={(x) => <StoreCard store={x.item} />}>
          </FlatList>}
      </View>
    </>

  )
}

export default StoresListScreen

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    margin: 4,
    padding: 5
  },
  textBox: {
    marginHorizontal: '2%',
    marginBottom: '1%',
  },
  logout: {
    marginLeft: 'auto',
    width: 100,
    height: 45
  }
})

