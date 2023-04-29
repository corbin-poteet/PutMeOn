import { TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { ListItem, Avatar } from '@rneui/base';

const ArtistSearchResult = ({ artist, onPress, onDeselect, isChecked }: {
  artist: SpotifyApi.ArtistObjectFull,
  onPress: (artist: SpotifyApi.ArtistObjectFull) => void,
  onDeselect: (artist: SpotifyApi.ArtistObjectFull) => void
  isChecked?: boolean
}) => {

  const [checked, setChecked] = useState(isChecked);

  function onPressed() {
    setChecked(!checked);
    if (!checked) {
      onPress(artist);
    } else {
      onDeselect(artist);
    }
  }

  return (
    <TouchableHighlight onPress={onPressed} >
      <ListItem bottomDivider>
        <Avatar
          rounded
          source={{ uri: artist.images[0]?.url }}
          size="medium"
          containerStyle={{ backgroundColor: '#c2c2c2', shadowColor: 'black', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 0 } }}
        />
        <ListItem.Content>
          <ListItem.Title>{artist.name}</ListItem.Title>
          <ListItem.Subtitle>Artist</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.CheckBox
          // Use ThemeProvider to change the defaults of the checkbox
          iconType="material"
          checkedIcon="clear"
          uncheckedIcon="add"
          checkedColor="red"
          checked={checked ? checked : false}
          pointerEvents="none"
        />
      </ListItem>
    </TouchableHighlight>

  )
}

export default ArtistSearchResult