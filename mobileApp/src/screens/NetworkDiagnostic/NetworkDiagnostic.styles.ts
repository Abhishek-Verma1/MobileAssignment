import {Platform} from 'react-native';

export default {
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 24,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  success: {
    color: '#27ae60',
  },
  error: {
    color: '#e74c3c',
  },
  results: {
    marginTop: 16,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
  },
  resultsContainer: {
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  resultHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  resultItem: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 8,
  },
  helpContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 12,
  },
  helpItem: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
    paddingLeft: 8,
  },
  portTestItem: {
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  portLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  portStatus: {
    marginLeft: 8,
    marginTop: 2,
    fontSize: 14,
  },
  usePortButton: {
    backgroundColor: '#2980b9',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginLeft: 8,
  },
  usePortButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
};
