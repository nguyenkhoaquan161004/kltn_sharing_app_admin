export default function TestPage() {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 20px 25px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#2563eb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold'
                }}>
                    SA
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                    Admin Dashboard
                </h1>
                <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>
                    Quản lý hệ thống Shario
                </p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="admin@shario.com"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <button
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginTop: '8px'
                        }}
                    >
                        Đăng nhập
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    padding: '12px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1e40af'
                }}>
                    <p style={{ fontWeight: '500', margin: '0 0 4px 0' }}>Tài khoản demo:</p>
                    <p style={{ margin: '0' }}>Email: admin@shario.com</p>
                    <p style={{ margin: '0' }}>Password: admin123</p>
                </div>
            </div>
        </div>
    )
}
