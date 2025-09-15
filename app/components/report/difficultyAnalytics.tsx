import React from 'react'
import {View,Text} from 'react-native'
import { useAppSelector } from '@/redux/hooks'
import {selectDifficultyWise} from '../../../redux/slices/detailedReport'

const difficultyAnalytics = () => {
  const data = useAppSelector(selectDifficultyWise) || [];
  
  return (
    <View>
      <Text>difficultyAnalytics</Text>
    </View>
  )
}

export default difficultyAnalytics