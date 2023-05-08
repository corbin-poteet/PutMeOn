import { View, Text, ImageURISource, Touchable } from 'react-native'
import React, { useState } from 'react'
import { ListItem, Avatar } from '@rneui/base';
import { SeedType } from '../hooks/useDeckManager';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '@rneui/themed';

const SelectedSeed = ({ track, remove }: { track?: SpotifyApi.TrackObjectFull, remove?: (track: SpotifyApi.TrackObjectFull) => void }) => {
  
  function removeSelf() {
    if (remove && track) {
      remove(track);
    }
  }

  return (
    <View>
      {track ?
        <ListItem bottomDivider>
          <Avatar
            source={{ uri: track.album.images[0].url }}
            size="medium"
            containerStyle={{ backgroundColor: '#c2c2c2', shadowColor: 'black', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 0 } }}
          />
          <ListItem.Content>
            <ListItem.Title>{track.name}</ListItem.Title>
            <ListItem.Subtitle>{track.artists[0].name}</ListItem.Subtitle>
          </ListItem.Content>
          <Button
            key="1"
            icon={{
              name: 'close',
              type: 'material',
              size: 26,
            }}
            onPress={removeSelf}
            buttonStyle={{ backgroundColor: 'transparent', opacity: 0.5 }}
          />
        </ListItem>
        : <></>}
    </View>
  )
}

export default SelectedSeed