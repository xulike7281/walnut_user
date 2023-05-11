export async function runCloud(runName, data) {
  console.log('runName',runName)
  console.log('data',data)
	let c1 = new wx.cloud.Cloud({
		appid: 'wxa01cba08b3a94941',
		// 资源方 AppID
		resourceAppid: 'wx12766c930cd6ff2f',
		// 资源方环境 ID
		resourceEnv: 'walnut-4gz3b5sy69d79f25',
	})
	await c1.init()
  const res = await c1.callFunction({
		name: runName,
		data: data,
  })
  console.log('2222',res)
	return res

}