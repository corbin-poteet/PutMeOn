import { TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { ListItem, Avatar } from '@rneui/base';

const TrackSearchResult = ({ track, onPress, onDeselect, isChecked }: {
  track: SpotifyApi.TrackObjectFull,
  onPress: (track: SpotifyApi.TrackObjectFull) => void,
  onDeselect: (track: SpotifyApi.TrackObjectFull) => void
  isChecked?: boolean
}) => {

  const [checked, setChecked] = useState(isChecked);

  function onPressed() {
    setChecked(!checked);
    if (!checked) {
      onPress(track);
    } else {
      onDeselect(track);
    }
  }

  return (
    <TouchableHighlight onPress={onPressed} >
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

export default TrackSearchResult