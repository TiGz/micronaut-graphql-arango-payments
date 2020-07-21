package com.tigz.domain.paymentrequest;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.core.beans.BeanWrapper;
import lombok.*;

import java.util.Map;

@Builder
@Getter
@Setter
@Introspected
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    private String payorEntityId;
    private String payeeEntityId;
    private Integer amount;
    private String currency;
    private String paymentReference;
    private String memo;
    private String onBehalfOfEntityId;
    private String transmissionHint;
    private String desiredArrivalDateTime;

    /**
     * Use Micronauts non-reflection @{@link BeanWrapper} to efficiently
     * map from our incoming map of attributes into a defined POJO
     * @param attrs
     * @return
     */
    public static PaymentRequest of (Map<String,Object> attrs){
        final PaymentRequest request = new PaymentRequest();
        final BeanWrapper<PaymentRequest> wrapper = BeanWrapper.getWrapper(request);
        wrapper.getBeanProperties().forEach(p -> {
            if ( attrs.containsKey(p.getName()) ){
                p.set(request, attrs.get(p.getName()));
            }
        });
        return request;
    }

}
