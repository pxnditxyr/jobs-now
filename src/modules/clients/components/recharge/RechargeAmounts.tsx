import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { actions } from 'astro:actions'

const initialOptions = {
  currency: "USD",
  intent: "capture",
}

const rechargeOptions = [
  {
    amount: 2,
    stars: 1,
    emoji: '☕'
  },
  {
    amount: 6,
    stars: 3,
    emoji: '🍔'
  },
  {
    amount: 10,
    stars: 5,
    emoji: '🍕'
  },
]

interface IProps {
  clientId: string
  walletId: string
}

export const RechargeAmounts = ( { clientId, walletId }: IProps ) => {

  const [ selectedAmount, setSelectedAmount ] = useState<number | null>(null)
  const [ selectedStars, setSelectedStars ] = useState<number>( 0 )
  const [ isProcessing, setIsProcessing ] = useState( false )
  const [ isSuccess, setIsSuccess ] = useState( false )

  const setRechargeAmount = async ( amount: number, stars: number ) => {
    const { error } = await actions.rechargeAmountWallet({
      id: walletId,
      amount,
      stars,
    })

    if ( error ) {
      Swal.fire({
        icon: 'error',
        title: '¡Ups! Algo salió mal en la recarga 😢',
        text: error.message,
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Recarga exitosa! 🎉',
        text: 'Tu cuenta ha sido recargada con éxito.',
      })
    }
  }

  const handleCreateOrder = ( _data: any, actions: any ) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: selectedAmount,
          },
        },
      ],
    })
  }

  const handleApprove = async ( _data: any, actions: any ) => {
    setIsProcessing( true )
    return actions.order.capture().then( async ( details: any ) => {
      setIsProcessing( false )
      console.log( 'Transaction completed by ' + details.payer.name.given_name )
      if ( !selectedAmount ) return
      await setRechargeAmount( selectedAmount, selectedStars )
      setIsSuccess( true )
    } )
  }

  return (
    <div className="p-6 sm:p-8">

      { !isSuccess ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {rechargeOptions.map((option) => (
              <div
                key={option.amount}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAmount === option.amount
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300'
                }`}
                onClick={() => {
                  setSelectedAmount( option.amount )
                  setSelectedStars( option.stars )
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl">{ option.emoji }</span>
                  <span className="text-xl sm:text-2xl font-bold text-teal-700">{ option.stars }⭐</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="mt-2 text-sm text-gray-600 font-semibold">Recargar</p>
                  <span className="text-xl sm:text-2xl font-bold text-teal-700">${ option.amount }</span>
                </div>
              </div>
            ))}
          </div>

          { selectedAmount && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-teal-700">
                <i className="mdi mdi-cash-check mr-2"></i>Monto seleccionado: ${ selectedAmount }
              </h2>
              <PayPalScriptProvider
                options={{
                  ...initialOptions,
                  clientId,
                }}
              >
                <PayPalButtons
                  createOrder={ handleCreateOrder }
                  onApprove={ handleApprove }
                  style={{ layout: "horizontal" }}
                />
              </PayPalScriptProvider>
            </div>
          ) }

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-8">
            <h2 className="text-xl font-semibold mb-3 text-teal-700">
              <i className="mdi mdi-shield-check mr-2"></i>Beneficios de recargar con PayPal 🌟
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="mdi mdi-check-circle text-green-500 mr-2"></i>
                <span>Transacciones seguras y protegidas 🔒</span>
              </li>
              <li className="flex items-center">
                <i className="mdi mdi-flash text-yellow-500 mr-2"></i>
                <span>Recargas instantáneas ⚡</span>
              </li>
              <li className="flex items-center">
                <i className="mdi mdi-cash-refund text-blue-500 mr-2"></i>
                <span>Fácil proceso de reembolso 💱</span>
              </li>
            </ul>
          </div>

          {isProcessing && (
            <div className="text-center">
              <i className="mdi mdi-loading mdi-spin text-4xl text-teal-600"></i>
              <p className="mt-2 text-lg">Procesando tu pago... 🕒</p>
            </div>
          )}
        </>
      ) : (
          <div className="text-center">
            <i className="mdi mdi-check-circle text-6xl text-green-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-teal-800 mb-4">¡Recarga exitosa! 🎉</h2>
            <p className="text-lg text-gray-600 mb-8">
              Tu cuenta ha sido recargada con éxito. El saldo se actualizará en breve.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors"
            >
              <i className="mdi mdi-refresh mr-2"></i>Realizar otra recarga
            </button>
          </div>
        ) }
    </div>
  )
}
