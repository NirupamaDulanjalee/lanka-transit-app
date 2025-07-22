import { StyleSheet } from 'react-native';
import Colours from '../../constants/colours';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '90%',
    maxHeight: '90%',
    padding: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#333',
  },
  icon: {
    fontSize: 24,
    color: '#333',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingVertical: 8,
  },
  cellLabel: {
    flex: 1.2,
    paddingRight: 8,
  },
  cellInput: {
    flex: 2,
    justifyContent: 'center',
  },
  cellInputRow: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    color: '#222',
    fontWeight: '400',
  },
  subLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#888',
    fontSize: 18,
    paddingVertical: 2,
    color: '#222',
  },
  locationValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  pencilButton: {
    marginLeft: -24, 
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  distancesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
    marginTop: 8,
  },
  distancesHeader: {
    fontSize: 18,
    fontWeight: '400',
    color: '#222',
  },
  distancesSubHeader: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  distancesList: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 0,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    // limit height to 3 items (each ~52px + padding)
    maxHeight: 3 * 52 + 24, // 3 items + add button + padding
  },
  distancesScroll: {
    maxHeight: 3 * 52 + 24,
  },
  distanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bbdefb',
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  distanceCol: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  distanceValue: {
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  distanceUnit: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  addDistance: {
    backgroundColor: '#bbdefb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
   
    marginBottom: 4,
  },
  addIcon: {
    fontSize: 32,
    color: '#333',
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  checkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  checkIcon: {
    fontSize: 38,
    color: '#333',
    fontWeight: '300',
  },
});
export default styles;