import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { Button, Text, TextInput } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const submit = () => {
        const emailValue = email.trim();
        const passwordValue = password.trim();
        if(!!emailValue && !!passwordValue)
            auth()
                .signInWithEmailAndPassword(emailValue, passwordValue)
                .then(() => {
                    console.log('User account created & signed in!');
                    navigation.navigate('Stores');
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                    }

                    console.error(error);
                });
    }

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Login</Text>
            <TextInput
                label="Email"
                mode='outlined'
                textContentType='emailAddress'
                value={email}
                style={styles.textBox}
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                label="Password"
                mode='outlined'
                value={password}
                textContentType='password'
                secureTextEntry={true}
                style={styles.textBox}
                onChangeText={text => setPassword(text)}
            />
            <Button onPress={submit} mode='contained' style={styles.button}>Login</Button>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        margin: '5%',
        paddingTop: '30%'
    },
    textBox: {
        marginTop: '3%',
        width: '100%'
    },
    button: {borderRadius: 4, marginTop: '6%'}
})