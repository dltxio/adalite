import {h, Component} from 'preact'
import {connect} from '../../../helpers/connect'

import Alert from '../../common/alert'

const InitialContent = () => (
  <div className="sidebar-content">
    <div className="sidebar-item spacy">
      <Alert alertType="info sidebar">
        <p>
          AdaLite supports three means of accessing your wallet. For enhanced security, we recommend
          you to use a <strong>hardware wallet.</strong>
        </p>
        <a
          className="sidebar-link"
          href="https://github.com/vacuumlabs/adalite/wiki/AdaLite-FAQ#hardware-wallets"
          rel="noopener"
          target="blank"
        >
          What is a Hardware Wallet
        </a>
      </Alert>
    </div>
  </div>
)

const MnemonicContent = () => (
  <div className="sidebar-content">
    <div className="sidebar-item">
      <Alert alertType="info sidebar">
        <strong>What is a mnemonic?</strong>
        <p>
          It’s a passphrase which serves as a seed to restore the addresses and their respective
          public and private keys associated with your wallet.
        </p>
      </Alert>
    </div>
    <div className="sidebar-item spacy">
      <Alert alertType="info sidebar">
        <p>
          AdaLite is fully interoperable with{' '}
          <a
            className="sidebar-link"
            href="https://yoroi-wallet.com/"
            rel="noopener"
            target="blank"
          >
            Yoroi-type
          </a>{' '}
          mnemonics (15 words).
        </p>
      </Alert>
    </div>
    <Alert alertType="warning sidebar">
      <p>
        Mnemonic is not the most secure access method. For enhanced security, we strongly recommend
        you to use a{' '}
        <a
          className="sidebar-link"
          href="https://github.com/vacuumlabs/adalite/wiki/AdaLite-FAQ#hardware-wallets"
          rel="noopener"
          target="blank"
        >
          hardware wallet.
        </a>
      </p>
    </Alert>
  </div>
)

const WalletContent = () => (
  <div className="sidebar-content">
    <div className="sidebar-item">
      <Alert alertType="success sidebar">
        <p>
          <strong>Hardware wallets</strong> provide the best security for your private key since it
          never leaves the device when signing transactions.
        </p>
      </Alert>
    </div>
    <div className="sidebar-item">
      <p className="sidebar-paragraph">
        Computers might be vulnerable to attacks on program and system level. Typing your mnemonic
        directly may put your wallet at risk. We currently support Trezor Model T, Ledger Nano S and
        Nano X hardware wallets.
      </p>
    </div>
    <div className="sidebar-item">
      <a
        className="sidebar-link"
        href="https://wiki.trezor.io/Cardano_(ADA)"
        rel="noopener"
        target="blank"
      >
        How to use Trezor T with AdaLite
      </a>
    </div>
    <div className="sidebar-item">
      <a
        className="sidebar-link"
        href="https://github.com/vacuumlabs/adalite/wiki/How-to-use-Ledger-Nano-S-and-Nano-X-with-AdaLite"
        rel="noopener"
        target="blank"
      >
        How to use Ledger Nano S/X with AdaLite
      </a>
    </div>
    <div className="sidebar-item">
      <a
        className="sidebar-link"
        href="https://github.com/vacuumlabs/adalite/wiki/Troubleshooting"
        rel="noopener"
        target="blank"
      >
        Troubleshooting
      </a>
    </div>
  </div>
)

const FileContent = () => (
  <div className="sidebar-content">
    <div className="sidebar-item spacy">
      <Alert alertType="info sidebar">
        <strong>What is a key file?</strong>
        <p>
          It’s an encrypted JSON file you can export and load later instead of typing the whole
          mnemonic passphrase to access your wallet.
        </p>
      </Alert>
    </div>
    <Alert alertType="warning sidebar">
      <p>
        The encrypted key file is not the most secure access method. For enhanced security, we
        strongly recommend you to use a{' '}
        <a
          className="sidebar-link"
          href="https://github.com/vacuumlabs/adalite/wiki/AdaLite-FAQ#hardware-wallets"
          rel="noopener"
          target="blank"
        >
          hardware wallet.
        </a>
      </p>
    </Alert>
  </div>
)

interface Props {
  authMethod: '' | 'mnemonic' | 'hw-walet' | 'file'
}

class LoginPageSidebar extends Component<Props> {
  render({authMethod}) {
    return (
      <aside className="sidebar">
        {authMethod === '' && <InitialContent />}
        {authMethod === 'mnemonic' && <MnemonicContent />}
        {authMethod === 'hw-wallet' && <WalletContent />}
        {authMethod === 'file' && <FileContent />}
      </aside>
    )
  }
}

export default connect((state) => ({
  authMethod: state.authMethod,
}))(LoginPageSidebar)
