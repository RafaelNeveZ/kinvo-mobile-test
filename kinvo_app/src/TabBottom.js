import React, { useState } from 'react';
import {
  StyleSheet, View, Alert,
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import ResumoImg from '../assets/Icons/resumo_icon.png';
import CarteiraImg from '../assets/Icons/carteira_icon.png';
import ContaImg from '../assets/Icons/conta_icon.png';
import PremiumImg from '../assets/Icons/premium_icon.png';
import AddImg from '../assets/Icons/add_icon.png';
import Premium from './Tab/Premium';
import Resumo from './Tab/Resumo';
import Conta from './Tab/Conta';
import Pages from './Tab/Pages';
import BottomIcon from './Components/BottomIcon';
import InputModal from './Components/InputModal';
import { firebaseDatabase } from '../utils/firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageView: {
    flex: 1,
  },
  bottomBar: {
    height: 65,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#DAE0E3',
    flexDirection: 'row',
  },
});

const bottomList = [
  {
    Img: ResumoImg,
    indexPage: 0,
    title: 'Resumo',
  },
  {
    Img: CarteiraImg,
    indexPage: 1,
    title: 'Carteira',
  },
  {
    Img: PremiumImg,
    indexPage: 2,
    title: 'Premium',
  },
  {
    Img: ContaImg,
    indexPage: 3,
    title: 'Conta',
  },
];

const TabBottom = () => {
  const [selected, setSelected] = useState(1);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [MyViewPager, setMyViewPager] = useState(React.createRef());
  const onPageSelect = (id) => {
    setSelected(id);
    if (MyViewPager !== null) {
      MyViewPager.current.setPage(id);
    }
  };

  const onButtonClicked = () => {
    setModalAddVisible(true);
  };

  const onBtnAddPressed = (newProduct, productTypeId) => {
    setModalAddVisible(false);
    const {
      productName, financialInstitutionName, equity, profitability,
    } = newProduct;
    firebaseDatabase.ref('data').push(
      {
        productName,
        financialInstitutionName,
        equity,
        profitability,
        productTypeId,
        portfolioProductId: Math.random(),
      },
    ).catch((erro) => {
      Alert.alert('Erro', `${erro}`);
    });
  };


  const Tabs = [{
    id: 0,
    page: <Resumo />,
    title: 'Resumo',
  },
  {
    id: 1,
    page: <Pages backPage={() => onPageSelect(0)} />,
    title: 'Carteira',
  },
  {
    id: 2,
    page: <Premium />,
    title: 'Premium',
  },
  {
    id: 3,
    page: <Conta />,
    title: 'Conta',
  },
  ];

  return (
    <View style={styles.container}>
      <InputModal
        title="Novo Produto"
        visible={modalAddVisible}
        onClose={() => setModalAddVisible(false)}
        textBtn="ADICIONAR PRODUTO"
        onBtnPress={(newProduct, id) => onBtnAddPressed(newProduct, id)}
      />
      {/*  <View style={styles.pageView}>
      </View> */}
      <ViewPager
        style={{ flex: 1 }}
        initialPage={selected}
        ref={MyViewPager}
        onPageSelected={event => setSelected(event.nativeEvent.position)}
      >
        <View key="0">
          {Tabs[0].page}
        </View>
        <View key="1">
          {Tabs[1].page}
        </View>
        <View key="2">
          {Tabs[2].page}
        </View>
        <View key="3">
          {Tabs[3].page}
        </View>
      </ViewPager>
      <View style={styles.bottomBar}>
        {
            bottomList.map((item, index) => {
              const { Img, indexPage, title } = item;
              if (index === (bottomList.length) / 2) {
                return (
                  <View style={{ flexDirection: 'row' }} key={Math.random()}>
                    <BottomIcon
                      Img={AddImg}
                      Button
                      onPageSelect={() => onButtonClicked()}
                    />
                    <BottomIcon
                      Img={Img}
                      indexPage={indexPage}
                      title={title}
                      onPageSelect={id => onPageSelect(id)}
                      selected={selected}
                    />
                  </View>
                );
              }
              return (
                <BottomIcon
                  Img={Img}
                  indexPage={indexPage}
                  title={title}
                  onPageSelect={id => onPageSelect(id)}
                  selected={selected}
                  backPage={() => setSelected(0)}
                  key={Math.random()}
                />
              );
            })
          }
      </View>
    </View>
  );
};

export default TabBottom;
