import { screenState } from "@/atoms/screen";
import StorageItem from "@/components/atoms/StorageItem";
import Layout, { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { getItem } from "@/utils/storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Platform, Text } from "react-native";
import { useRecoilState } from "recoil";

const Storage = (): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen]: any = useRecoilState(screenState);
    const [data, setData] = useState<any[]>([]);

    const handleSetScreen = () => {
        setScreen('보관함');
    }

    const getStorage = async () => {
        const LIST = await getItem('pillStorage');
        if (LIST) {
            setData(JSON.parse(LIST));
        }
    }

    useFocusEffect(() => {
        getStorage();
    })

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, []);

    const styles = StyleSheet.create({
        scrollViewWrapper: {
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        viewWrapper: {
            minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 15,
            paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
            backgroundColor: '#ffffff',
        },
        titleWrapper: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingVertical: 16,
            paddingHorizontal: 8,
        },
        title: {
            color: '#000',
            fontSize: font(24),
            fontFamily: os.font(700, 700),
            includeFontPadding: false,
            paddingBottom: 0,
        },
        numberText: {
            fontSize: font(14),
            fontFamily: os.font(500, 500),
            color: '#848484',
            includeFontPadding: false,
            paddingBottom: 0,
        },
        pillList: {
            position: 'relative',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        noList: {
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 200,
        },
        noListText: {
            color: '#000',
            fontSize: font(18),
            fontFamily: os.font(500, 500),
            includeFontPadding: false,
            paddingBottom: 0,
        }
    });

    return (
        <Layout.default>
            <ScrollView style={styles.viewWrapper}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>알약</Text>
                    <Text style={styles.numberText}>{data.length}개 보관됨</Text>
                </View>
                {data.length > 0 ?
                    <View style={styles.pillList}>
                        {data.map((i: any) => (
                            <StorageItem key={i._id} data={i} refresh={getStorage} />
                        ))}
                    </View>
                    :
                    <View style={styles.noList}>
                        <Text style={styles.noListText}>보관된 알약이 없습니다.</Text>
                    </View>
                }
            </ScrollView>
        </Layout.default>
    )
}

export default Storage;