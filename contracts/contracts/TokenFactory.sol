pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./Event.sol";

contract EventFactory is Ownable {


    mapping(address => Event[]) private events;
    
    Event[] private allEvents;

    function addEvent(Event newEvent, address owner) private {
        allEvents.push(newEvent);
        events[owner].push(newEvent);
    }


    function getTicketsByAddress(address user) view external returns (Event.Data[] memory){
    uint256 len = allEvents.length;
    Event.Data[] memory eventsWithUsersTickets = new Event.Data[](len);
    uint256 count = 0;
    for(uint256 i = 0; i < len; i++) {
        if(allEvents[i].balanceOf(user) > 0){
            eventsWithUsersTickets[count] = allEvents[i].getEventInfo();
            count++;
        }
    }
    assembly {
        mstore(eventsWithUsersTickets, count)
    }
    return eventsWithUsersTickets;
}


    function getEventsByAddress(address user) external view returns (Event.Data[] memory result) {
    Event[] storage data = events[user];
    uint256 data_len = data.length;
    result = new Event.Data[](data_len);
    for(uint256 i = 0; i < data_len; i++){
        result[i] = data[i].getEventInfo();
    }
    if(msg.sender != user){
        for(uint256 i = 0; i < data_len; i++){
            delete result[i].eventLocation;
            result[i].isOfflineEvent = false;
        }
    }
    return result;
}



    function deployEvent(
        uint256 _price,
        uint256 _time_start,
        uint256 _time_end,
        string memory _event_name,
        string memory _event_symbol,
        string memory _company_name,
        string memory _event_location,
        bool _is_offline_event,
        string memory base_uri
        // bytes32 _r,
        // bytes32 _s,
        // uint8 _v
    ) external returns(address) {
        // bytes32 hash = keccak256(
        //     abi.encodePacked(_event_name, _event_symbol, _company_name, _price, address(this))
        // );

        // address signer = ecrecover(hash, _v, _r, _s);
        // require(signer == owner(), "Invalid signature");
        require(_time_start < _time_end, "time_end have to be bigger then time_start");
        require(block.timestamp < _time_end, "time_end have to be bigger then current time");
        Event newEvent = new Event(_price, _time_start, _time_end, _event_name, _event_symbol, _company_name, _event_location, msg.sender, _is_offline_event, base_uri);
        addEvent(newEvent, msg.sender);
        return address(newEvent);
    }
}
