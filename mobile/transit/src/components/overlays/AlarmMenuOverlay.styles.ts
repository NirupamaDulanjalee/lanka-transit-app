import { StyleSheet } from 'react-native';
import Colours from '../../constants/colours';

const styles = StyleSheet.create({
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '105%',
    backgroundColor: Colours.BACKGROUNDOVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  menuContainer: {
    width: 330,
    minHeight: 300,
    backgroundColor: Colours.WHITE,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 1001,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'left',
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  alarmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colours.WHITE,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  selectedItem: {
    backgroundColor: '#2f2f2f',
  },
  leftIcon: {
    marginRight: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  locationName: {
    fontWeight: 'bold',
    fontFamily: 'Inter',
    fontSize: 22,
    color: Colours.BLACK,
  },
  selectedText: {
    color: Colours.SELECTED_TEXT,
  },
  selected_Trash: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: Colours.SELECTED_TEXT,
  },
  addressText: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    borderRadius: 20,
    padding: 6,
  },
  trashIcon: {
    width: 16,
    height: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
