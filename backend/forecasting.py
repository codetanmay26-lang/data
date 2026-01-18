"""ML Forecasting Module for Migration Index Prediction"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from prophet import Prophet
from statsmodels.tsa.arima.model import ARIMA
from sqlalchemy.orm import Session
from models import MigrationIndex
import warnings
warnings.filterwarnings('ignore')

class MigrationForecaster:
    """Forecast future migration index using Prophet and ARIMA"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_available_states(self) -> list:
        """Get list of all available states in database"""
        states = self.db.query(MigrationIndex.state).distinct().all()
        
        # Valid Indian states and UTs (official names)
        valid_states = {
            'Andaman and Nicobar Islands',
            'Andhra Pradesh',
            'Arunachal Pradesh',
            'Assam',
            'Bihar',
            'Chandigarh',
            'Chhattisgarh',
            'Dadra and Nagar Haveli and Daman and Diu',
            'Daman and Diu',
            'Delhi',
            'Goa',
            'Gujarat',
            'Haryana',
            'Himachal Pradesh',
            'Jammu and Kashmir',
            'Jharkhand',
            'Karnataka',
            'Kerala',
            'Ladakh',
            'Lakshadweep',
            'Madhya Pradesh',
            'Maharashtra',
            'Manipur',
            'Meghalaya',
            'Mizoram',
            'Nagaland',
            'Odisha',
            'Puducherry',
            'Punjab',
            'Rajasthan',
            'Sikkim',
            'Tamil Nadu',
            'Telangana',
            'Tripura',
            'Uttar Pradesh',
            'Uttarakhand',
            'West Bengal'
        }
        
        # Normalize state names (mapping variations to canonical names)
        state_mapping = {
            'andhra pradesh': 'Andhra Pradesh',
            'arunachal pradesh': 'Arunachal Pradesh',
            'assam': 'Assam',
            'bihar': 'Bihar',
            'chhattisgarh': 'Chhattisgarh',
            'chhatisgarh': 'Chhattisgarh',
            'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
            'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
            'daman and diu': 'Daman and Diu',
            'daman & diu': 'Daman and Diu',
            'delhi': 'Delhi',
            'goa': 'Goa',
            'gujarat': 'Gujarat',
            'haryana': 'Haryana',
            'himachal pradesh': 'Himachal Pradesh',
            'jammu and kashmir': 'Jammu and Kashmir',
            'jammu & kashmir': 'Jammu and Kashmir',
            'jharkhand': 'Jharkhand',
            'karnataka': 'Karnataka',
            'kerala': 'Kerala',
            'ladakh': 'Ladakh',
            'lakshadweep': 'Lakshadweep',
            'madhya pradesh': 'Madhya Pradesh',
            'maharashtra': 'Maharashtra',
            'manipur': 'Manipur',
            'meghalaya': 'Meghalaya',
            'mizoram': 'Mizoram',
            'nagaland': 'Nagaland',
            'odisha': 'Odisha',
            'orissa': 'Odisha',
            'puducherry': 'Puducherry',
            'pondicherry': 'Puducherry',
            'punjab': 'Punjab',
            'rajasthan': 'Rajasthan',
            'sikkim': 'Sikkim',
            'tamil nadu': 'Tamil Nadu',
            'telangana': 'Telangana',
            'tripura': 'Tripura',
            'uttar pradesh': 'Uttar Pradesh',
            'uttarakhand': 'Uttarakhand',
            'uttaranchal': 'Uttarakhand',
            'west bengal': 'West Bengal',
            'west bangal': 'West Bengal',
            'west bengli': 'West Bengal',
            'west  bengal': 'West Bengal',
            'westbengal': 'West Bengal',
            'andaman & nicobar islands': 'Andaman and Nicobar Islands',
            'andaman and nicobar islands': 'Andaman and Nicobar Islands',
            'andaman & nicobar islands': 'Andaman and Nicobar Islands',
            'chandigarh': 'Chandigarh',
            'the dadra and nagar haveli and daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
            'jammu and kashmir': 'Jammu and Kashmir',
            'jammu and kashmir': 'Jammu and Kashmir',
        }
        
        # Filter and normalize states
        cleaned_states = set()
        for state_tuple in states:
            state_name = state_tuple[0]
            if state_name:
                # Normalize to lowercase for mapping lookup
                normalized = state_mapping.get(state_name.lower().strip(), None)
                if normalized and normalized in valid_states:
                    cleaned_states.add(normalized)
        
        return sorted(cleaned_states) if cleaned_states else sorted(valid_states)
    
    def get_districts_for_state(self, state: str) -> list:
        """Get all districts for a state"""
        # Map input state name to normalized form
        state_mapping = {
            'andhra pradesh': 'Andhra Pradesh',
            'arunachal pradesh': 'Arunachal Pradesh',
            'assam': 'Assam',
            'bihar': 'Bihar',
            'chhattisgarh': 'Chhattisgarh',
            'chhatisgarh': 'Chhattisgarh',
            'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
            'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
            'daman and diu': 'Daman and Diu',
            'daman & diu': 'Daman and Diu',
            'delhi': 'Delhi',
            'goa': 'Goa',
            'gujarat': 'Gujarat',
            'haryana': 'Haryana',
            'himachal pradesh': 'Himachal Pradesh',
            'jammu and kashmir': 'Jammu and Kashmir',
            'jammu & kashmir': 'Jammu and Kashmir',
            'jharkhand': 'Jharkhand',
            'karnataka': 'Karnataka',
            'kerala': 'Kerala',
            'ladakh': 'Ladakh',
            'lakshadweep': 'Lakshadweep',
            'madhya pradesh': 'Madhya Pradesh',
            'maharashtra': 'Maharashtra',
            'manipur': 'Manipur',
            'meghalaya': 'Meghalaya',
            'mizoram': 'Mizoram',
            'nagaland': 'Nagaland',
            'odisha': 'Odisha',
            'orissa': 'Odisha',
            'puducherry': 'Puducherry',
            'pondicherry': 'Puducherry',
            'punjab': 'Punjab',
            'rajasthan': 'Rajasthan',
            'sikkim': 'Sikkim',
            'tamil nadu': 'Tamil Nadu',
            'telangana': 'Telangana',
            'tripura': 'Tripura',
            'uttar pradesh': 'Uttar Pradesh',
            'uttarakhand': 'Uttarakhand',
            'uttaranchal': 'Uttarakhand',
            'west bengal': 'West Bengal',
            'west bangal': 'West Bengal',
            'west bengli': 'West Bengal',
            'andaman & nicobar islands': 'Andaman and Nicobar Islands',
            'andaman and nicobar islands': 'Andaman and Nicobar Islands',
            'chandigarh': 'Chandigarh',
        }
        
        # Normalize state input
        normalized_state = state_mapping.get(state.lower().strip(), state)
        
        # Query districts for normalized state
        results = self.db.query(MigrationIndex.state, MigrationIndex.district).filter(
            MigrationIndex.state.ilike(f"%{normalized_state}%") | (MigrationIndex.state == state),
            MigrationIndex.pincode.is_(None)
        ).distinct().all()
        
        # Extract unique district names, filtering out invalid entries
        districts = set()
        for _, district in results:
            if district and district.strip() and len(district.strip()) > 2 and district.lower() not in [
                'null', 'na', 'n/a', 'unknown', '0', '-', ''
            ]:
                districts.add(district.strip())
        
        return sorted(districts)
    
    def get_historical_data(self, state: str, district: str) -> pd.DataFrame:
        """Fetch historical migration index data for a district"""
        # Query data
        results = self.db.query(MigrationIndex).filter(
            MigrationIndex.state == state,
            MigrationIndex.district == district,
            MigrationIndex.pincode.is_(None),  # District-level only
            MigrationIndex.migration_index.isnot(None)
        ).order_by(MigrationIndex.date).all()
        
        if not results:
            return None
        
        # Convert to DataFrame
        data = []
        for r in results:
            # Calculate migration_index if null
            if r.migration_index is None or (r.child_enrolments == 0 and r.adult_updates > 0):
                # If child_enrolments is 0 but adult_updates exist, use adult_updates as proxy
                if r.child_enrolments == 0 and r.adult_updates > 0:
                    migration_idx = float(r.adult_updates) / 1000  # Scale down for readability
                else:
                    migration_idx = r.migration_index
            else:
                migration_idx = r.migration_index
            
            if migration_idx is not None and migration_idx > 0:
                data.append({
                    'date': r.date,
                    'migration_index': migration_idx,
                    'child_enrolments': r.child_enrolments,
                    'adult_updates': r.adult_updates
                })
        
        if not data:
            return None
        
        df = pd.DataFrame(data)
        
        # Aggregate by date (in case of duplicates)
        df = df.groupby('date').agg({
            'migration_index': 'mean',
            'child_enrolments': 'sum',
            'adult_updates': 'sum'
        }).reset_index()
        
        df = df.sort_values('date')
        return df if len(df) > 0 else None
    
    def forecast_prophet(self, df: pd.DataFrame, periods: int = 30) -> pd.DataFrame:
        """
        Forecast using Facebook Prophet
        
        Args:
            df: Historical data with 'date' and 'migration_index' columns
            periods: Number of days to forecast
        
        Returns:
            DataFrame with forecasted values
        """
        # Prepare data for Prophet (requires 'ds' and 'y' columns)
        prophet_df = df[['date', 'migration_index']].copy()
        prophet_df.columns = ['ds', 'y']
        
        # Remove any NaN values
        prophet_df = prophet_df.dropna(subset=['y'])
        
        # Also remove any inf values
        prophet_df = prophet_df[~prophet_df["y"].isin([np.inf, -np.inf])]
        
        if len(prophet_df) < 5:
            return None
        
        # Initialize and fit Prophet model
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=False,
            interval_width=0.95
        )
        
        model.fit(prophet_df)
        
        # Create future dataframe (only future dates, not including training data)
        last_date = pd.Timestamp(prophet_df['ds'].max())
        future = model.make_future_dataframe(periods=periods)
        future = future[future['ds'] > last_date]  # Only future dates
        
        # Predict
        forecast = model.predict(future)
        
        # Prepare result
        result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].copy()
        result.columns = ['date', 'predicted_index', 'lower_bound', 'upper_bound']
        
        # Clamp bounds to realistic values (migration index should be >= 0)
        result['lower_bound'] = result['lower_bound'].clip(lower=0)
        result['upper_bound'] = result['upper_bound'].clip(lower=result['predicted_index'])
        
        return result
    
    def forecast_arima(self, df: pd.DataFrame, periods: int = 30) -> pd.DataFrame:
        """
        Forecast using ARIMA
        
        Args:
            df: Historical data with 'date' and 'migration_index' columns
            periods: Number of days to forecast
        
        Returns:
            DataFrame with forecasted values
        """
        # Prepare data
        ts_data = df[['date', 'migration_index']].copy()
        ts_data = ts_data.dropna()
        ts_data = ts_data.set_index('date')
        
        if len(ts_data) < 10:
            return None
        
        try:
            # Fit ARIMA model (p=1, d=1, q=1 - simple model)
            model = ARIMA(ts_data['migration_index'], order=(1, 1, 1))
            fitted_model = model.fit()
            
            # Forecast
            forecast_result = fitted_model.forecast(steps=periods)
            
            # Get confidence intervals
            forecast_df = fitted_model.get_forecast(steps=periods)
            conf_int = forecast_df.conf_int()
            
            # Create future dates
            last_date = ts_data.index.max()
            future_dates = pd.date_range(start=last_date + timedelta(days=1), periods=periods)
            
            # Create result dataframe
            result = pd.DataFrame({
                'date': future_dates,
                'predicted_index': forecast_result.values,
                'lower_bound': conf_int.iloc[:, 0].values,
                'upper_bound': conf_int.iloc[:, 1].values
            })
            
            return result
            
        except Exception as e:
            print(f"ARIMA forecasting failed: {e}")
            return None
    
    def ensemble_forecast(self, state: str, district: str, periods: int = 30, method: str = 'prophet') -> dict:
        """
        Generate forecast for a district
        
        Args:
            state: State name
            district: District name
            periods: Number of days to forecast (default: 30)
            method: 'prophet', 'arima', or 'ensemble'
        
        Returns:
            Dictionary with forecast results
        """
        # Get historical data
        historical_df = self.get_historical_data(state, district)
        
        if historical_df is None or len(historical_df) < 5:
            return {
                'error': 'Insufficient historical data',
                'message': f'Need at least 5 data points, found {len(historical_df) if historical_df is not None else 0}'
            }
        
        # Generate forecasts
        prophet_forecast = None
        arima_forecast = None
        
        if method in ['prophet', 'ensemble']:
            try:
                prophet_forecast = self.forecast_prophet(historical_df, periods)
            except Exception as e:
                print(f"Prophet failed: {e}")
        
        if method in ['arima', 'ensemble']:
            try:
                arima_forecast = self.forecast_arima(historical_df, periods)
            except Exception as e:
                print(f"ARIMA failed: {e}")
        
        # Prepare result
        result = {
            'state': state,
            'district': district,
            'historical_data_points': len(historical_df),
            'forecast_period_days': periods,
            'method': method,
            'historical_avg_index': float(historical_df['migration_index'].mean()),
            'historical_trend': self._calculate_trend(historical_df)
        }
        
        # Add forecasts
        if method == 'ensemble' and prophet_forecast is not None and arima_forecast is not None:
            # Average the two forecasts
            ensemble_df = prophet_forecast.copy()
            ensemble_df['predicted_index'] = (
                prophet_forecast['predicted_index'] + arima_forecast['predicted_index']
            ) / 2
            ensemble_df['lower_bound'] = (
                prophet_forecast['lower_bound'] + arima_forecast['lower_bound']
            ) / 2
            ensemble_df['upper_bound'] = (
                prophet_forecast['upper_bound'] + arima_forecast['upper_bound']
            ) / 2
            result['forecast'] = ensemble_df.to_dict('records')
            
        elif method == 'prophet' and prophet_forecast is not None:
            result['forecast'] = prophet_forecast.to_dict('records')
            
        elif method == 'arima' and arima_forecast is not None:
            result['forecast'] = arima_forecast.to_dict('records')
            
        else:
            return {
                'error': 'Forecasting failed',
                'message': f'Could not generate {method} forecast with available data'
            }
        
        # Add interpretation
        result['interpretation'] = self._interpret_forecast(result['forecast'])
        
        return result
    
    def _calculate_trend(self, df: pd.DataFrame) -> str:
        """Calculate if migration index is rising, falling, or stable"""
        if len(df) < 2:
            return "Insufficient data"
        
        # Simple linear trend
        x = np.arange(len(df))
        y = df['migration_index'].values
        
        # Calculate slope
        slope = np.polyfit(x, y, 1)[0]
        
        # Determine trend
        if slope > 0.1:
            return "Rising"
        elif slope < -0.1:
            return "Falling"
        else:
            return "Stable"
    
    def _interpret_forecast(self, forecast: list) -> dict:
        """Interpret forecast results"""
        if not forecast:
            return {}
        
        # Get first and last predicted values
        first_prediction = forecast[0]['predicted_index']
        last_prediction = forecast[-1]['predicted_index']
        
        # Calculate trend
        change_percent = ((last_prediction - first_prediction) / first_prediction) * 100 if first_prediction != 0 else 0
        
        # Determine migration pressure
        avg_prediction = np.mean([f['predicted_index'] for f in forecast])
        
        # Interpret based on absolute values, not just trend
        if avg_prediction > 3.0:
            pressure = "Very High Migration Pressure"
            impact = "Cities will experience significant population growth. Urgent: Plan infrastructure, housing, services expansion."
        elif avg_prediction > 2.0:
            pressure = "High Migration Pressure"
            impact = "Moderate-to-high population growth. Expand public services, housing, transport."
        elif avg_prediction > 1.0:
            pressure = "Moderate Migration Pressure"
            impact = "Steady growth. Maintain/upgrade current infrastructure."
        elif avg_prediction > 0.5:
            pressure = "Low Migration Pressure"
            impact = "Minimal growth. Monitor trends; no immediate expansion needed."
        else:
            pressure = "Very Low/Declining"
            impact = "Risk of population decline. May indicate rural depopulation or service deficiencies."
        
        return {
            'average_predicted_index': float(avg_prediction),
            'change_percent': float(change_percent),
            'trend': "Increasing" if change_percent > 5 else "Decreasing" if change_percent < -5 else "Stable",
            'migration_pressure': pressure,
            'policy_impact': impact
        }
    
    def get_top_growth_predictions(self, state: str, top_n: int = 10) -> list:
        """
        Get top N districts predicted to have highest migration
        
        Args:
            state: State name
            top_n: Number of top districts to return
        
        Returns:
            List of districts with predicted growth
        """
        # Get all districts in state
        districts = self.db.query(MigrationIndex.district).filter(
            MigrationIndex.state == state,
            MigrationIndex.pincode.is_(None)
        ).distinct().all()
        
        predictions = []
        failed = []
        for (district,) in districts:
            forecast = self.ensemble_forecast(state, district, periods=30, method='prophet')
            if 'forecast' in forecast and len(forecast['forecast']) > 0:
                avg_pred = np.mean([f['predicted_index'] for f in forecast['forecast']])
                predictions.append({
                    'district': district,
                    'predicted_avg_index': float(avg_pred),
                    'status': self._get_status(avg_pred)
                })
            elif 'error' in forecast:
                failed.append((district, forecast['message']))
        
        # Sort by predicted index
        predictions.sort(key=lambda x: x['predicted_avg_index'], reverse=True)
        
        if len(predictions) == 0 and len(failed) > 0:
            print(f"WARNING: No successful forecasts. First few failures:")
            for dist, msg in failed[:3]:
                print(f"  {dist}: {msg}")
        
        return predictions[:top_n]
    
    def _get_status(self, index_value):
        """Get migration status from index value"""
        if index_value > 3.0:
            return "Very High Migration"
        elif index_value > 2.0:
            return "High Migration"
        elif index_value > 1.0:
            return "Moderate Migration"
        else:
            return "Low Migration"

