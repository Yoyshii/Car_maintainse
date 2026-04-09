import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPart, setSelectedPart] = useState(null);
  const [mileage, setMileage] = useState(50000);

  const carData = {
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'Серебристый',
    vin: 'JTDKB20U087654321'
  };

  const parts = [
    { id: 'hood', name: 'Капот', color: '#FF6B6B', icon: '🔧', description: 'Двигатель, фильтры, жидкости' },
    { id: 'wheels', name: 'Колеса', color: '#4ECDC4', icon: '🛞', description: 'Шины, балансировка, давление' },
    { id: 'brakes', name: 'Тормоза', color: '#FF6B6B', icon: '🛑', description: 'Колодки, диски, жидкость' },
    { id: 'lights', name: 'Фары', color: '#FFD166', icon: '💡', description: 'Лампы, регулировка' },
  ];

  const serviceHistory = [
    { date: '15.01.2024', service: 'Замена масла', part: 'Капот', mileage: 45000, cost: 3500 },
    { date: '10.12.2023', service: 'Замена шин', part: 'Колеса', mileage: 40000, cost: 25000 },
  ];

  const CarSVG = () => (
    <svg width="400" height="300" style={{ transform: 'rotateY(30deg)' }}>
      <rect x="100" y="50" width="200" height="100" rx="10" fill="#4A90E2" />
      <rect x="120" y="30" width="160" height="30" rx="5" fill="#357ABD" />
      <circle cx="130" cy="170" r="20" fill="#333" />
      <circle cx="270" cy="170" r="20" fill="#333" />
      <rect x="140" y="60" width="120" height="40" rx="5" fill="#87CEEB" opacity="0.6" />
      <circle cx="105" cy="80" r="8" fill="#FFD166" />
      <circle cx="295" cy="80" r="8" fill="#FFD166" />
    </svg>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{
        padding: '20px 40px',
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>🚗 Car Maintenance Visualizer</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Интерактивная система контроля технического обслуживания</p>
        
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>МАРКА</div>
            <strong style={{ fontSize: '18px' }}>{carData.brand}</strong>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>МОДЕЛЬ</div>
            <strong style={{ fontSize: '18px' }}>{carData.model}</strong>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>ГОД ВЫПУСКА</div>
            <strong style={{ fontSize: '18px' }}>{carData.year}</strong>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>ТЕКУЩИЙ ПРОБЕГ (KM)</div>
            <strong style={{ fontSize: '20px', color: '#4CAF50' }}>{mileage.toLocaleString()} км</strong>
          </div>
        </div>
      </header>

      <nav style={{
        display: 'flex',
        background: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        {[
          { id: 'home', label: 'Главная', icon: '🏠' },
          { id: 'visualization', label: 'Визуализация ТО', icon: '🚗' },
          { id: 'analysis', label: 'Умный анализ', icon: '🧠' },
          { id: 'maintenance', label: 'Детальное ТО', icon: '🔧' },
          { id: 'vehicles', label: 'Список авто', icon: '📋' },
          { id: 'reports', label: 'Отчеты', icon: '📊' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            style={{
              padding: '15px 25px',
              background: currentView === item.id ? '#f0f7ff' : 'transparent',
              border: 'none',
              borderBottom: currentView === item.id ? '3px solid #1a237e' : 'none',
              color: currentView === item.id ? '#1a237e' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {currentView === 'home' && (
          <div>
            <h2 style={{ color: '#1a237e', marginBottom: '30px' }}>Добро пожаловать в систему визуализации ТО!</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div 
                onClick={() => setCurrentView('visualization')}
                style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  textAlign: 'center'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚗</div>
                <h3 style={{ margin: '0 0 15px 0', color: '#1a237e' }}>3D Визуализация</h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  Интерактивный 3D вид автомобиля с возможностью выбора деталей
                </p>
              </div>
              
              <div 
                onClick={() => setCurrentView('analysis')}
                style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  textAlign: 'center'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🧠</div>
                <h3 style={{ margin: '0 0 15px 0', color: '#1a237e' }}>Умный анализ</h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  Анализ состояния автомобиля и рекомендации по обслуживанию
                </p>
              </div>
              
              <div 
                onClick={() => setCurrentView('maintenance')}
                style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  textAlign: 'center'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔧</div>
                <h3 style={{ margin: '0 0 15px 0', color: '#1a237e' }}>Детальное ТО</h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  Подробная история технического обслуживания и планирование работ
                </p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualization' && (
          <div>
            <h2 style={{ color: '#1a237e', marginBottom: '20px' }}>🚗 Визуализация автомобиля</h2>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: '300px' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '25px', 
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ marginTop: 0 }}>Автомобиль {carData.brand} {carData.model}</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <CarSVG />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {parts.map((part) => (
                      <button
                        key={part.id}
                        onClick={() => setSelectedPart(part)}
                        style={{
                          padding: '12px 20px',
                          background: selectedPart?.id === part.id ? '#e3f2fd' : 'white',
                          border: `2px solid ${selectedPart?.id === part.id ? '#2196F3' : part.color}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          minWidth: '140px'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{part.icon}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 'bold', color: part.color }}>{part.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{part.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '25px', 
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  height: '100%'
                }}>
                  {selectedPart ? (
                    <>
                      <h3 style={{ color: selectedPart.color, marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{selectedPart.icon}</span>
                        {selectedPart.name}
                      </h3>
                      
                      <div style={{ margin: '20px 0' }}>
                        <div style={{ 
                          padding: '15px', 
                          background: '#f9f9f9', 
                          borderRadius: '10px',
                          marginBottom: '20px'
                        }}>
                          <h4 style={{ margin: '0 0 10px 0' }}>Статус:</h4>
                          <div style={{ 
                            display: 'inline-block',
                            padding: '5px 15px',
                            background: '#4CAF50',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '14px'
                          }}>
                            ✅ В норме
                          </div>
                          <div style={{ marginTop: '10px', fontSize: '14px' }}>
                            Следующая проверка: через 3,000 км
                          </div>
                        </div>
                        
                        <h4>Добавить запись ТО:</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <input 
                            type="number" 
                            placeholder="Текущий пробег (км)" 
                            style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Описание работ" 
                            style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                          />
                          <input 
                            type="number" 
                            placeholder="Стоимость (₽)" 
                            style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                          />
                          <button style={{
                            padding: '12px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}>
                            💾 Сохранить запись
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div style={{ fontSize: '48px', marginBottom: '20px' }}>👈</div>
                      <h4>Выберите деталь автомобиля</h4>
                      <p style={{ color: '#666' }}>
                        Нажмите на одну из деталей слева для просмотра информации и добавления записей ТО
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'analysis' && (
          <div>
            <h2 style={{ color: '#1a237e', marginBottom: '20px' }}>🧠 Умный анализ состояния</h2>
            
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3>Рекомендации по обслуживанию:</h3>
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#4CAF50' }}>✅</span>
                    <span>Замена масла выполнена вовремя</span>
                  </li>
                  <li style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#FF9800' }}>⚠️</span>
                    <span>Тормозные колодки требуют проверки через 2,000 км</span>
                  </li>
                  <li style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#4CAF50' }}>✅</span>
                    <span>Шины в хорошем состоянии</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentView === 'maintenance' && (
          <div>
            <h2 style={{ color: '#1a237e', marginBottom: '20px' }}>🔧 История технического обслуживания</h2>
            
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: 0, marginBottom: '20px' }}>История работ</h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Дата</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Вид работ</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Деталь</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Пробег</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Стоимость</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceHistory.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{item.date}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{item.service}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{item.part}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{item.mileage.toLocaleString()} км</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{item.cost.toLocaleString()} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentView === 'vehicles' && (
          <div>
            <h2 style={{ color: '#1a237e', marginBottom: '20px' }}>📋 Список автомобилей</h2>
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚘</div>
              <h3>Управление автомобилями</h3>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                Раздел в разработке
              </p>
            </div>
          </div>
        )}

        {currentView === 'reports' && (
          <div>
            <h2 style={{ color: '#1a237e', marginBottom: '20px' }}>📊 Отчеты и аналитика</h2>
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📈</div>
              <h3>Статистика и отчеты</h3>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                Раздел в разработке
              </p>
            </div>
          </div>
        )}
      </main>

      <footer style={{
        padding: '20px',
        background: '#1a237e',
        color: 'white',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <div>Car Maintenance Visualizer • 2024</div>
      </footer>
    </div>
  );
}

export default App;