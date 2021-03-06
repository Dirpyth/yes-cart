/*
 * Copyright 2009 Inspire-Software.com
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package org.yes.cart.domain.entity.impl;


import org.apache.commons.lang.StringUtils;
import org.yes.cart.domain.entity.ProductType;
import org.yes.cart.domain.entity.xml.ProductTypeRangeListXStreamProvider;
import org.yes.cart.domain.misc.navigation.range.RangeList;
import org.yes.cart.stream.xml.XStreamProvider;

import java.time.Instant;

/**
 * User: Igor Azarny iazarny@yahoo.com
 * Date: 27 0ct 2012
 * Time: 9:10 AM
 */
public class ProductTypeAttrEntity implements org.yes.cart.domain.entity.ProductTypeAttr, java.io.Serializable {

    private long productTypeAttrId;
    private long version;

    private String attributeCode;
    private ProductType producttype;
    private int rank;
    private boolean visible;
    private boolean similarity;
    private boolean numeric;
    private String navigationTemplate;
    private String navigationType;
    private String rangeNavigation;
    private Instant createdTimestamp;
    private Instant updatedTimestamp;
    private String createdBy;
    private String updatedBy;
    private String guid;

    public ProductTypeAttrEntity() {
    }


    @Override
    public String getAttributeCode() {
        return this.attributeCode;
    }

    @Override
    public void setAttributeCode(final String attributeCode) {
        this.attributeCode = attributeCode;
    }

    @Override
    public ProductType getProducttype() {
        return this.producttype;
    }

    @Override
    public void setProducttype(final ProductType producttype) {
        this.producttype = producttype;
    }

    @Override
    public int getRank() {
        return this.rank;
    }

    @Override
    public void setRank(final int rank) {
        this.rank = rank;
    }

    @Override
    public boolean isVisible() {
        return this.visible;
    }

    @Override
    public void setVisible(final boolean visible) {
        this.visible = visible;
    }

    @Override
    public boolean isSimilarity() {
        return this.similarity;
    }

    @Override
    public void setSimilarity(final boolean similarity) {
        this.similarity = similarity;
    }

    @Override
    public boolean isNumeric() {
        return numeric;
    }

    @Override
    public void setNumeric(final boolean numeric) {
        this.numeric = numeric;
    }

    @Override
    public String getNavigationTemplate() {
        return navigationTemplate;
    }

    @Override
    public void setNavigationTemplate(final String navigationTemplate) {
        this.navigationTemplate = navigationTemplate;
    }

    @Override
    public String getNavigationType() {
        return this.navigationType;
    }

    @Override
    public void setNavigationType(final String navigationType) {
        this.navigationType = navigationType;
    }

    @Override
    public String getRangeNavigation() {
        return this.rangeNavigation;
    }

    @Override
    public void setRangeNavigation(final String rangeNavigation) {
        this.rangeNavigation = rangeNavigation;
    }

    @Override
    public Instant getCreatedTimestamp() {
        return this.createdTimestamp;
    }

    @Override
    public void setCreatedTimestamp(final Instant createdTimestamp) {
        this.createdTimestamp = createdTimestamp;
    }

    @Override
    public Instant getUpdatedTimestamp() {
        return this.updatedTimestamp;
    }

    @Override
    public void setUpdatedTimestamp(final Instant updatedTimestamp) {
        this.updatedTimestamp = updatedTimestamp;
    }

    @Override
    public String getCreatedBy() {
        return this.createdBy;
    }

    @Override
    public void setCreatedBy(final String createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String getUpdatedBy() {
        return this.updatedBy;
    }

    @Override
    public void setUpdatedBy(final String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @Override
    public String getGuid() {
        return this.guid;
    }

    @Override
    public void setGuid(final String guid) {
        this.guid = guid;
    }

    @Override
    public long getProductTypeAttrId() {
        return productTypeAttrId;
    }

    @Override
    public long getId() {
        return this.productTypeAttrId;
    }


    @Override
    public void setProductTypeAttrId(final long productTypeAttrId) {
        this.productTypeAttrId = productTypeAttrId;
    }

    @Override
    public long getVersion() {
        return version;
    }

    public void setVersion(final long version) {
        this.version = version;
    }

    private static final XStreamProvider xStreamProvider = new ProductTypeRangeListXStreamProvider();

    private RangeList rangeListCache = null;

    @Override
    public RangeList getRangeList() {
        if (rangeListCache == null && StringUtils.isNotBlank(getRangeNavigation())) {
            rangeListCache = (RangeList) xStreamProvider.fromXML(getRangeNavigation());
        }
        return rangeListCache;
    }

    @Override
    public void setRangeList(final RangeList rangeList) {
        setRangeNavigation(xStreamProvider.toXML(rangeList));
        this.rangeListCache = rangeList;
    }

}


