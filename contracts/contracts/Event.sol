pragma solidity ^0.8.0;
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



contract Event is ERC721, ERC721URIStorage ,Ownable {
    uint256 private constant PERCENTAGE_100 = 1000000000000000000000000000;
    uint256 private constant DECIMAL = 1000000000000000000;
    string private BASE_URI_OF_EVENT;

    struct Data {
            uint256 price;
            uint256 time_start;
            uint256 time_end;
            string event_name;
            string event_symbol;
            string company_name;
            string eventLocation;
            address event_address;
            address owner;
            bool isOfflineEvent;
        }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256[]) private users;
    
    

    Data private data;

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function getTicketsIdOfOwner(address ownerAddress) external view returns(uint256[] memory){
        return users[ownerAddress];
    }

    function _getAmountAfterDiscount(uint256 amount_, uint256 discount_)
        internal
        pure
        returns (uint256)
    {
        return (amount_ * (PERCENTAGE_100 - discount_)) / PERCENTAGE_100;
    }

    function getBalance() external view returns(uint256){
        return address(this).balance;
    }

    function _payWithETH(uint256 discount_) internal returns(uint256) {
        uint256 amountToPay_;
        if(discount_ != 0) {
            amountToPay_ = _getAmountAfterDiscount(
                data.price,
                discount_
            );
        }else {
            amountToPay_ = data.price;
        }
        
        require(msg.value >= amountToPay_, "TokenContract: Invalid currency amount.");

        uint256 extraCurrencyAmount_ = msg.value - amountToPay_;

        if (extraCurrencyAmount_ > 0) {
            (bool success_, ) = msg.sender.call{value: extraCurrencyAmount_}("");
            require(success_, "TokenContract: Failed to return currency.");
        }

        return amountToPay_;
    }

    function widthDraw() onlyOwner external payable {
        payable(owner()).transfer(address(this).balance);
    }

    

    constructor  (
        uint256 _price,
        uint256 time_start,
        uint256 time_end,
        string memory _event_name,
        string memory _event_symbol,
        string memory _company_name,
        string memory eventLocation,
        address owner,
        bool isOfflineEvent,
        string memory base_uri
        
    ) ERC721(_event_name, _event_symbol){
        transferOwnership(owner);
        BASE_URI_OF_EVENT =  base_uri;
        data = Data(_price, time_start, time_end, _event_name, _event_symbol, _company_name, eventLocation, address(this), owner, isOfflineEvent);
    }

    function getEventInfo() public view returns(Data memory) {
        return data;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    

    function _baseURI() internal view override returns (string memory) {
        return BASE_URI_OF_EVENT;
    }

    function mintTicket(address recipient,uint256 discount_,string memory uri) payable external returns(uint256){
        require(data.time_end > block.timestamp, "you cant mint ticket, that was depricated");

        uint256 amountToPay_;

        if (data.price != 0 || recipient != address(0)) {
                amountToPay_ = _payWithETH(discount_);
        }

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, uri);
        users[recipient].push(newTokenId);

        return newTokenId;
    }
}