import { StyleSheet } from 'react-native';
import { COLORS, DIMENSIONS } from '../constants';

export const commonStyles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.SPACING_LARGE,
    paddingTop: DIMENSIONS.SPACING_LARGE,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_WHITE,
  },

  pageHeader: {
    marginBottom: DIMENSIONS.SPACING_EXTRA_LARGE,
  },
  
  pageTitle: {
    fontSize: DIMENSIONS.FONT_SIZE_TITLE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.SPACING_SMALL,
  },
  
  pageSubtitle: {
    fontSize: DIMENSIONS.FONT_SIZE_MEDIUM,
    color: COLORS.TEXT_TERTIARY,
  },

  section: {
    marginBottom: DIMENSIONS.SPACING_LARGE,
  },
  
  sectionTitle: {
    fontSize: DIMENSIONS.FONT_SIZE_LARGE,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.SPACING_MEDIUM,
  },

  listContainer: {
    flex: 1,
  },
  
  listItem: {
    marginBottom: 4,
  },

  actionContainer: {
    marginTop: DIMENSIONS.SPACING_LARGE,
    marginBottom: DIMENSIONS.SPACING_LARGE,
  },

  card: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    padding: DIMENSIONS.SPACING_MEDIUM,
    borderRadius: 12,
    marginBottom: DIMENSIONS.SPACING_LARGE,
  },
  
  highlightCard: {
    backgroundColor: COLORS.BACKGROUND_BLUE,
    padding: DIMENSIONS.SPACING_MEDIUM,
    borderRadius: 12,
    marginBottom: DIMENSIONS.SPACING_LARGE,
  },
});